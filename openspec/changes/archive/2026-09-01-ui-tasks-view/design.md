## Context

`src/lib/tasks.ts` already exposes `createTask`, `listTodaysTasks`, `completeTask` (plus `editTask`/`deleteTask`, not used here), all scoped by RLS to the signed-in user (see [[task-management]] spec). `App.tsx` is wrapped in `AuthGate`/`useSession` and currently renders the leftover Vite scaffold behind it. See proposal.md - Why/What Changes for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Make completing a task feel instantaneous — no spinner between the click and the visual change.
- Keep today's list and the points counter always consistent with each other, computed from one source of truth.

**Non-Goals:**
- No optimistic-update library or global state manager — the data set (today's tasks) is small and local to one view.
- No offline support or retry queues for failed requests.
- No styling system/design tokens beyond a small fixed pastel palette for this view.

## Decisions

- **A `useTasks` hook (`src/hooks/useTasks.ts`) owns today's task list as local React state**, loaded once via `listTodaysTasks()` on mount. It exposes `{ tasks, addTask(title), completeTask(id), loading, error }`. This keeps the "list of today's tasks" as one piece of state that both the list rendering and the points counter derive from, so they can never disagree.
- **`addTask` and `completeTask` update local state directly from the row the data-layer function returns, instead of re-fetching the whole list.** `createTask`/`completeTask` in `src/lib/tasks.ts` already return the affected row; the hook appends/replaces that one row in the local array. This is what satisfies the "no waiting for a full list refetch" requirement — it's a targeted state update, not a general optimistic-UI system.
- **`completeTask` is applied optimistically, then reconciled.** On calling complete, the hook immediately marks the local task as completed (before the network call resolves) so the checkbox and points counter update in the same tick as the click. If the underlying call throws, the hook reverts that one task's local state back to incomplete and surfaces the error (a small inline message near that task) — this satisfies the "Completion request fails" scenario without a generic rollback framework.
- **The points counter is a derived value, not separate state.** `TasksView` computes `tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0)` from the same `tasks` array the list renders from, every render — no separate query, so it's always in sync with what's on screen, including during the optimistic-completion window.
- **Quick-add clears its input immediately on submit**, before awaiting `addTask`. If the create fails, the hook surfaces an error (inline message) but does not restore the typed text — retyping a short title is cheap, and blocking the input on a pending request would reintroduce the friction this feature is meant to remove.
- **One `TasksView` component holds quick-add input, task list, and points counter** (`src/components/TasksView.tsx`), backed by `useTasks`. Given the small scope (three tightly related pieces of UI, no reuse elsewhere yet), splitting into separate `TaskList`/`TaskItem`/`QuickAddTask`/`PointsCounter` components would add indirection without benefit right now.
- **Pastel palette as a handful of CSS custom properties** in a new `src/components/TasksView.css` (e.g. `--bg`, `--surface`, `--accent-lavender`, `--accent-mint`, `--text`), scoped to this view. `App.tsx`'s scaffold markup (hero image, Vite/React links, counter demo) is deleted along with its now-dead rules in `App.css`, since nothing will render them anymore.
- **`App.tsx` renders `<TasksView />` inside `AuthGate`**, keeping the existing logout button above it.

## Risks / Trade-offs

- [Optimistic completion can briefly show a task as done before the server confirms it] → Acceptable: on failure the hook reverts within the same request's round-trip and shows an inline error; there's no persistent inconsistency since nothing else reads server state in between.
- [Local `useTasks` state can drift from the database if the user has another tab open] → Accepted for this change (single-user, single-tab usage is the primary case); revisit if multi-tab/multi-device sync becomes a requirement.
