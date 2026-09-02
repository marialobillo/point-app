## Why

Three small gaps remain in the daily tasks app: points on a task can't be corrected once created (`editTask` exists in the data layer but nothing calls it), there's no way to see what was done on a previous day, and there's no sense of momentum (a streak) to reinforce consistent use. These three pieces are independent of each other and can ship together without depending on one another.

## What Changes

- **Edit points**: Show each task's points in the today view, and let the user click the points value to edit it inline (numeric input, Enter or blur to save), using the existing `editTask` function, with the same optimistic-update/revert-on-failure pattern as completing a task.
- **History**: Add a new function to `src/lib/tasks.ts` to fetch tasks across a date range (not just today), and a new read-only view listing past days that have at least one task, each day's tasks and total points. No completing or editing from this view.
- **Streaks**: Compute the current streak (consecutive days, including today if applicable, with at least one completed task) and display it next to the daily points counter in the today view.

## Capabilities

### New Capabilities
- `task-history`: A read-only view of past days' tasks and their totals.
- `streak-tracking`: Computes and displays the current consecutive-day completion streak.

### Modified Capabilities
- `task-management`: Adds a data-access function to fetch tasks across a date range, used by both history and streak calculation.
- `tasks-ui`: The today view now shows each task's points and lets the user edit them inline.

## Impact

- `src/lib/tasks.ts`: new `listTasksInRange(fromDate, toDate)` function; no changes to existing functions' behavior.
- `src/hooks/useTasks.ts`: new `editPoints(id, points)` action with the same optimistic pattern as `completeTask`.
- `src/components/TasksView.tsx`: tasks now show their points value, editable inline.
- New view/component(s) for history and for the streak indicator; no new routing library — a simple in-app view toggle is enough for this project's scope.
- Out of scope: deleting tasks from the UI, editing a task's title, charts/graphs for history, and streak-related notifications/reminders.
