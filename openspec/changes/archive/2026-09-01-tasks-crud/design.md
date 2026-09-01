## Context

`src/supabaseClient.ts` already exports an initialized Supabase client. The `tasks` table exists with an open RLS policy (no auth). See proposal.md - Why/What Changes for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Provide a single, typed data-access module for the `tasks` table that the future UI layer can call directly.
- Make Supabase failures impossible to miss (no swallowed errors).

**Non-Goals:**
- No React components, hooks that manage local render state for a list, or loading/error UI state.
- No aggregation logic (e.g. total points earned today).
- No auth/session handling or RLS changes.

## Decisions

- **Plain async functions, not a React hook.** The scope is a data-access layer, not UI state management. A `useTasks` hook would bundle in loading/error state that belongs to a future UI change. Plain functions in `src/lib/tasks.ts` can be called from any future hook or component without forcing a specific state-management pattern now.
- **Error handling: throw on Supabase error.** Each function checks `error` on the Supabase response and throws a `TaskError` (a thin `Error` subclass wrapping the original Postgrest error) when present, instead of returning a `{ data, error }` tuple. Callers use try/catch. This matches idiomatic async/await usage and guarantees an unchecked error can't be ignored by omission (a returned `error` field can be destructured away silently; a throw cannot).
- **"Today" is computed client-side and passed as a filter, not via a DB default expression.** `listTodaysTasks()` computes today's date as `YYYY-MM-DD` in the client's local timezone and queries `task_date = <that date>`. This avoids relying on the DB server's timezone for "today" and keeps the function pure/testable (date can be injected in tests).
- **Edit is a partial update.** `editTask(id, { title?, points? })` only includes the fields provided in the Supabase `update()` payload, so calling it with just `points` does not overwrite `title`.
- **Single module file.** All five operations (`createTask`, `listTodaysTasks`, `completeTask`, `editTask`, `deleteTask`) plus the `Task` interface and `TaskError` live in one `src/lib/tasks.ts` file. The surface area is small enough that splitting into multiple files would add indirection without benefit.

## Risks / Trade-offs

- [Throwing errors requires every caller to use try/catch] → Acceptable trade-off for this scope since there is no UI yet to standardize on a different pattern; documented clearly in code so a future UI change can decide how to present errors.
- [Client-computed "today" can drift from DB server date near midnight in edge cases across timezones] → Low impact for a personal task app; revisit if multi-timezone usage becomes a requirement.
