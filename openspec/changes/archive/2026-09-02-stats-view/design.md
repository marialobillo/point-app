## Context

`src/lib/tasks.ts` exposes `listTasksInRange(fromDate, toDate)` and a `lastNDaysRange(n)` helper currently used with a fixed 60-day window by `useTaskHistory` and `useStreak`. `useStreak.ts` computes a consecutive-day streak from that same 60-day window and is rendered in `TasksView.tsx` next to the points counter. Navigation between views lives in `App.tsx` as local `view` state (`'today' | 'history'`), rendered via a simple two-button nav bar. See proposal.md - Why for motivation.

## Goals / Non-Goals

**Goals:**
- Remove the streak concept cleanly (hook, UI, spec) with no dangling references.
- Add a third `Stats` view following the same data-fetch-then-render pattern as `HistoryView`/`useTaskHistory`.
- Support period windows wider than the existing 60-day cap (year = 365 days) without changing `listTasksInRange`'s existing contract.

**Non-Goals:**
- No charts, comparisons, or streak/consistency metrics (see proposal.md - What Changes).
- No change to the `tasks` table schema or Supabase queries beyond the date range passed in.

## Decisions

- **New range helper, not a change to `lastNDaysRange`**: `lastNDaysRange(n)` already serves `useTaskHistory`. Rather than overload it with period semantics, add a small `periodRange(period: 'week' | 'month' | 'year')` in `tasks.ts` that computes `{ fromDate, toDate }` and delegates to the existing `lastNDaysRange`/`formatLocalDate` machinery: week → `lastNDaysRange(7)`, month → `lastNDaysRange(daysInCurrentMonth)`, year → `lastNDaysRange(365)`. This keeps `listTasksInRange` untouched and avoids a second date-range abstraction.
- **Rolling windows, not calendar-aligned periods**: "current month" is the last N days (N = days in the current calendar month) ending today, not the 1st-to-today of the calendar month. This matches the proposal's explicit day-count description (semana=7, mes=30-31, año=365) and reuses the existing day-count-based helper instead of introducing calendar-boundary logic.
- **New hook `useTaskStats(period)`**: mirrors `useTaskHistory`'s fetch/loading/error shape, but reduces the fetched tasks to `{ completedCount, totalPoints }` for the given period instead of grouping by day. Period changes re-trigger the fetch (period is a `useEffect` dependency).
- **Nav state widened to a third option**: `App.tsx`'s `view` state becomes `'today' | 'history' | 'stats'`; the existing button-pair pattern is extended with a third button rather than introducing a router.

## Risks / Trade-offs

- [Year-period query fetches up to 365 rows of task data client-side] → Acceptable at current scale (single-user daily task counts); no pagination needed now, matches existing client-side reduction pattern used by `useTaskHistory`.
- [Removing `streak-tracking` is a breaking spec removal] → Scenarios are preserved verbatim in the delta's `REMOVED Requirements` with `Reason`/`Migration` per openspec convention, so the historical spec is still traceable after archive.
