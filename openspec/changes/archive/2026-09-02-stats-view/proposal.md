## Why

The daily streak adds pressure around never breaking a chain, which doesn't fit the app's low-stimulation intent. A period-based stats view (totals for the current week, month, and year) gives the same sense of progress without the day-to-day consistency framing, and is more useful for glancing back at recent effort.

## What Changes

- **BREAKING**: Remove streak tracking entirely — delete `src/hooks/useStreak.ts`, remove the streak display from `TasksView.tsx`, and remove the `streak-tracking` capability spec.
- Add a new `Stats` tab to the app navigation (alongside `Today` and `History`) rendering a new `StatsView.tsx`.
- `StatsView` lets the user pick a period — current week, current month, or current year — and shows, for that period, the total number of completed tasks and the total points earned.
- Add a new function to `src/lib/tasks.ts` for fetching tasks in an arbitrary date range not capped at 60 days, so a full current-year period can be queried.
- Style `StatsView` with Tailwind using the existing palette (`bg`, `surface`, `ink`, `ink-muted`, `amber`, `mint`), consistent with `TasksView`/`HistoryView`.

Out of scope for this change: charts/visualizations, period-over-period comparisons, and any streak/consistency metric.

## Capabilities

### New Capabilities
- `task-stats`: Lets the signed-in user view total completed tasks and total points earned for a selected period (current week, current month, or current year).

### Modified Capabilities
- `streak-tracking`: Removed entirely — no longer computed or displayed.

## Impact

- `src/hooks/useStreak.ts`: deleted.
- `src/components/TasksView.tsx`: remove streak display and `useStreak` usage.
- `src/lib/tasks.ts`: add a period-range task-listing function.
- `src/App.tsx`: add `Stats` tab and route to new `StatsView.tsx`.
- `src/components/StatsView.tsx`: new file.
- `openspec/specs/streak-tracking/spec.md`: removed via delta (capability deleted at archive time).
