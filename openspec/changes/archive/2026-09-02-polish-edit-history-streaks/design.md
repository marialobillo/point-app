## Context

`src/lib/tasks.ts` has `createTask`/`listTodaysTasks`/`completeTask`/`editTask`/`deleteTask` (see [[task-management]]); `editTask` already supports updating `points` but nothing calls it yet. `src/hooks/useTasks.ts` owns today's task list with an optimistic-update pattern for `completeTask` (local state updated immediately, reverted on failure, per-task errors in `taskErrors`). `src/components/TasksView.tsx` (see [[tasks-ui]]) renders that list; it currently doesn't show each task's points at all. There is no router in the project — navigation so far is just `AuthGate` showing either the login screen or the app shell. See proposal.md - Why/What Changes for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Keep the three pieces (edit points, history, streaks) genuinely independent — each should be understandable and buildable without the other two.
- Reuse the existing optimistic-update pattern and data layer rather than inventing a new one.

**Non-Goals:**
- No routing library — a single boolean view toggle is enough for "today vs. history."
- No unbounded history queries — this is a personal-use app with little historical data; a bounded lookback window is an acceptable, documented trade-off (see Risks).
- No shared hook/query between history and streaks — keeping them decoupled (per proposal) is worth a small amount of duplicate fetching at this data scale.

## Decisions

- **`listTasksInRange(fromDate: string, toDate: string): Promise<Task[]>`** is added to `src/lib/tasks.ts`, mirroring `listTodaysTasks`'s shape (a `.gte('task_date', fromDate).lte('task_date', toDate)` filter instead of `.eq`). It's the one new data-access function shared conceptually by history and streaks — each capability calls it independently with its own range and own hook, so they stay decoupled (see Non-Goals).
- **A fixed 60-day lookback window** is used by both the history view (default range to show) and the streak calculation (how far back to look for a break). This is generous relative to the proposal's stated usage ("uso personal, pocos días de histórico") and keeps both queries simple bounded range queries instead of unbounded scans. Risk of under-counting a very long streak is accepted (see Risks).
- **Streak computed client-side**, not via a Supabase aggregate query: given the expected data volume (tens, not thousands, of rows), fetching the window and reducing it in JS is simpler to write, test, and reason about than a SQL aggregate, with no meaningful performance difference at this scale.
- **`editPoints(id, points)` added to `useTasks.ts`**, following the exact same shape as `completeTask`: optimistic local update, call `editTask(id, { points })`, replace with the returned row on success, revert and record an error on failure. It reuses the existing `taskErrors` record (keyed by task id) rather than adding a second parallel error map — a task row shows at most one error at a time regardless of which operation caused it.
- **Inline points editing lives in a small `EditablePoints` component**, not in `TasksView` itself: it owns its own local `editing`/draft-value state, renders the points as text (click to enter edit mode) or as a numeric `<input>` (Enter/blur to commit, calling a passed-in `onSave(points)`), and reads the shared row-level error via a prop pointing at the same `taskErrors[task.id]` used for completion. This keeps `TasksView` from needing to track per-row UI state for every task.
- **Views are toggled by a simple `view: 'today' | 'history'` state in `App.tsx`** (a tab-like pair of buttons), not a router. `TasksView` (today) and a new `HistoryView` are siblings under `AuthGate`; only one renders at a time. This is intentionally the simplest thing that satisfies "a new view" without adding a routing dependency for a single toggle.
- **`HistoryView` owns its own `useTaskHistory()` hook**: fetches the 60-day window via `listTasksInRange`, groups the results by `task_date` client-side, and exposes the list of days-with-tasks plus each day's tasks and completed-points total. No optimistic-update machinery is needed since the view is read-only.
- **The streak lives in its own `useStreak()` hook**, also calling `listTasksInRange` for the same 60-day window, independently of `useTaskHistory`. It reduces the fetched tasks into a set of "days with at least one completed task," then walks backward from today (falling back to yesterday if today has none) counting consecutive days until a gap. Rendered in `TasksView` next to the points counter.

## Risks / Trade-offs

- [A 60-day bounded window under-counts a streak or hides history older than 60 days] → Acceptable now given the stated personal, low-volume usage; if this becomes a real limitation, the fix is widening the window or adding pagination, not a schema change.
- [History and streak each issue their own `listTasksInRange` call, so the same rows may be fetched twice when both views could theoretically want the same window] → Accepted for decoupling; at personal-use volume this is a handful of extra rows over the network, not a real cost.
- [Client-side streak/history-day computation depends on the browser's local date matching the user's expectation of "today," same as `listTodaysTasks`'s existing `todayLocalDate()`] → Consistent with existing behavior already accepted in [[tasks-crud]]; not a new risk introduced by this change.
