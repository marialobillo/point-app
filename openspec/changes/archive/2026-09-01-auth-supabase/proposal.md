## Why

The `tasks` table currently has an open RLS policy ("Allow all for now") and `src/lib/tasks.ts` does not filter by user, so any client can read, edit, or delete any task. Before more UI is built on top of this data layer, each task needs to belong to a specific authenticated user, and only that user should be able to see or modify it.

## What Changes

- Enable Supabase Auth with email + password (signup and login).
- Add a minimal, functional-only login/signup component (no visual design — that belongs to the main UI block).
- Add session handling: detect whether a user is logged in, redirect to login when there isn't one, and support logout.
- **BREAKING**: Add a SQL migration that adds `user_id UUID REFERENCES auth.users(id) NOT NULL` to `tasks`. Existing rows without a `user_id` cannot satisfy this constraint, so the migration requires the table to be empty or backfilled before applying.
- **BREAKING**: Replace the `tasks` RLS policy "Allow all for now" with per-operation policies (SELECT/INSERT/UPDATE/DELETE) that only allow `auth.uid() = user_id`.
- Update `createTask` in `src/lib/tasks.ts` to read the current user from the Supabase Auth session and set `user_id` on insert. Verify `listTodaysTasks`, `completeTask`, `editTask`, and `deleteTask` continue to work correctly now that RLS restricts rows to the caller's own `user_id`.

## Capabilities

### New Capabilities
- `user-auth`: Email/password signup and login via Supabase Auth, session detection, redirect-to-login when unauthenticated, and logout.

### Modified Capabilities
- `task-management`: `Task` gains a `user_id` field; `createTask` now requires an authenticated session and sets `user_id`; `listTodaysTasks`, `completeTask`, `editTask`, and `deleteTask` are now scoped to the authenticated user's own rows (enforced by RLS).

## Impact

- New auth module/component(s) under `src/` (e.g. `src/lib/auth.ts`, a login/signup component) built on `src/supabaseClient.ts`.
- SQL migration on the `tasks` table (new `user_id` column, new RLS policies replacing "Allow all for now").
- `src/lib/tasks.ts`: `createTask` signature/behavior changes to require a session; other functions are re-verified against the new RLS policies.
- Out of scope: visual design of the login screen, password recovery, email verification, Google OAuth, and the main tasks UI (block 3).
