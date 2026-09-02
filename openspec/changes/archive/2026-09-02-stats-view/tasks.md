## 1. Remove streak tracking

- [x] 1.1 Delete `src/hooks/useStreak.ts`
- [x] 1.2 Remove the `useStreak` import and streak display from `src/components/TasksView.tsx`, keeping the points counter

## 2. Period range support in tasks.ts

- [x] 2.1 Add a `periodRange(period: 'week' | 'month' | 'year')` function to `src/lib/tasks.ts` that returns `{ fromDate, toDate }`, delegating to `lastNDaysRange` with 7 / days-in-current-month / 365 respectively

## 3. Stats data hook

- [x] 3.1 Add `src/hooks/useTaskStats.ts` exposing `{ completedCount, totalPoints, loading, error }` for a given period, re-fetching via `listTasksInRange(periodRange(period))` when the period changes

## 4. Stats view

- [x] 4.1 Create `src/components/StatsView.tsx` with a period selector (week / month / year) and the completed-count and total-points display, styled with Tailwind using the existing palette (`bg`, `surface`, `ink`, `ink-muted`, `amber`, `mint`), consistent with `TasksView`/`HistoryView`

## 5. Navigation

- [x] 5.1 Widen `App.tsx`'s view state to `'today' | 'history' | 'stats'` and add a `Stats` nav button following the existing `Today`/`History` button pattern
- [x] 5.2 Render `StatsView` when `view === 'stats'`

## 6. Verification

- [x] 6.1 Run the app locally and manually verify: streak no longer appears anywhere, each stats period shows correct completed-count and points totals, and switching periods updates the totals
