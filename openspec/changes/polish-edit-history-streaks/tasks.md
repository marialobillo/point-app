## 1. Shared data layer

- [x] 1.1 Add `listTasksInRange(fromDate: string, toDate: string): Promise<Task[]>` to `src/lib/tasks.ts` (`.gte('task_date', fromDate).lte('task_date', toDate)`), throwing `TaskError` on failure, matching the pattern of `listTodaysTasks`
- [x] 1.2 Add a small date-range helper (e.g. `lastNDaysRange(n: number)`) alongside `todayLocalDate()` for computing the shared 60-day lookback window

## 2. Piece 1: Edit points inline

- [x] 2.1 Add `editPoints(id: string, points: number)` to `src/hooks/useTasks.ts`: optimistic local update, calls `editTask(id, { points })`, replaces with the returned row on success, reverts and sets `taskErrors[id]` on failure — same shape as `completeTask`
- [x] 2.2 Create `src/components/EditablePoints.tsx`: renders `points` as text by default; click enters edit mode with a numeric input; Enter or blur with a changed, valid value calls `onSave(newPoints)`; Enter/blur with an unchanged or invalid value cancels without saving
- [x] 2.3 Wire `EditablePoints` into each task row in `TasksView.tsx`, passing the task's current `points` and an `onSave` that calls `editPoints(task.id, newPoints)` — the error display comes from the existing per-row `taskErrors[task.id]` paragraph shared with completion errors, rather than a duplicate error prop on `EditablePoints` itself
- [x] 2.4 Style `EditablePoints` consistently with the existing pastel palette in `TasksView.css`

## 3. Piece 2: History view

- [x] 3.1 Add `lastNDaysRange`-based fetch in a new `src/hooks/useTaskHistory.ts`: calls `listTasksInRange` for the last 60 days (excluding today), groups results by `task_date`, and exposes days-with-tasks (sorted, most recent first) plus each day's tasks and completed-points total
- [x] 3.2 Create `src/components/HistoryView.tsx`: lists the days-with-tasks from `useTaskHistory`; selecting a day shows that day's tasks (title, points, completion state) and its total; shows an empty-history message when there are no past days
- [x] 3.3 Style `HistoryView` consistently with the existing pastel palette (new `HistoryView.css` or extending `TasksView.css`)
- [x] 3.4 Confirm no completion/edit/delete controls are rendered in `HistoryView` (read-only by design) — reviewed: only text spans, no checkboxes/inputs/buttons that mutate a task

## 4. Piece 3: Streaks

- [x] 4.1 Create `src/hooks/useStreak.ts`: calls `listTasksInRange` for the last 60 days including today, reduces to the set of dates with at least one completed task, and computes the current streak (consecutive days ending at today, or at yesterday if today has no completion yet)
- [x] 4.2 Render the current streak in `TasksView.tsx` next to the daily points counter

## 5. Wire history into the app shell

- [x] 5.1 Add a `view: 'today' | 'history'` toggle to `App.tsx` (two buttons/tabs) rendering `<TasksView />` or `<HistoryView />` inside `AuthGate`, no routing library

## 6. Verification

- [x] 6.1 Run the app, sign in, and confirm each task row shows its points value
- [x] 6.2 Click a task's points, change the value, confirm it updates immediately and persists after a page reload
- [x] 6.3 Force a points-edit failure (e.g. via a temporary fetch override, as done for motivation-quotes) and confirm the displayed points revert
- [x] 6.4 Confirm entering an invalid value or leaving it unchanged does not trigger a save
- [x] 6.5 Create tasks across at least two different `task_date`s (adjusting the row directly, since the UI only creates tasks for today) and confirm the history view lists both days with correct per-day tasks and totals
- [x] 6.6 Confirm the history view has no complete/edit/delete controls
- [x] 6.7 Set up a short run of consecutive-day completions (via direct data seeding) and confirm the displayed streak matches the expected count, including a case with a gap breaking the streak and a case where today has no completion yet
- [x] 6.8 Confirm switching between the today and history views works via the toggle, with no page reload
- [x] 6.9 Clean up any test task rows/dates created during verification
