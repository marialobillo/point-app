## Context

`src/supabaseClient.ts` exports an initialized Supabase client (no auth wiring yet). `src/lib/tasks.ts` holds plain async CRUD functions for `tasks` (see [[task-management]] spec). The `tasks` table currently has one open RLS policy, "Allow all for now", and no `user_id` column. `App.tsx` is still the default Vite scaffold — the real tasks UI (block 3) has not been built yet. See proposal.md - Why/What Changes for motivation and scope.

## Goals / Non-Goals

**Goals:**
- Give the app a working, minimal (unstyled) way to sign up, log in, detect session state, and log out.
- Lock down `tasks` at the database level so a user can only ever see/modify their own rows, without relying on client-side filtering alone.
- Keep `src/lib/tasks.ts`'s existing function signatures stable except where `user_id` scoping requires a change.

**Non-Goals:**
- Visual design of the login/signup screen (block 3 territory).
- Password recovery, email verification flows, OAuth providers.
- Building or restyling the main tasks UI/App shell — this change only proves the auth gate works, it does not replace `App.tsx`'s placeholder content.
- Backfilling `user_id` for pre-existing rows (see Migration Plan — the table is expected to be empty/dev-only at this point).

## Decisions

- **Auth logic lives in `src/lib/auth.ts` as plain async functions** (`signUp(email, password)`, `signIn(email, password)`, `signOut()`, `getSession()`), mirroring the pattern already used in `src/lib/tasks.ts`. Errors are thrown as a `AuthError` wrapper (same shape as `TaskError`) rather than returned as tuples, for consistency with the existing data layer and to guarantee callers can't silently ignore a failure.
- **A `useSession` hook (`src/hooks/useSession.ts`) owns React-side session state.** It calls `supabase.auth.getSession()` once on mount and subscribes to `supabase.auth.onAuthStateChange` for live updates, exposing `{ session, loading }`. This is the one piece of React state management in this change — necessary because "is there a logged-in user" is exactly the kind of state a UI needs to react to (unlike the stateless CRUD functions in `tasks.ts`).
- **A single `AuthGate` component wraps authenticated content.** It uses `useSession`; while `loading` it renders nothing (or a trivial placeholder), when there's no session it renders a minimal `AuthScreen` (email/password fields, a submit button, and a toggle between "sign up" and "log in" — no styling beyond making it usable), and when there is a session it renders its `children`. This keeps the redirect-to-login behavior in one reusable place that block 3 can wrap around the real tasks UI later. For this change, `App.tsx` is wrapped with `AuthGate` just enough to prove the flow works end-to-end (plus a basic logout button), without rebuilding its scaffold content.
- **`createTask` resolves the current user via `supabase.auth.getUser()`** at call time and sets `user_id` on the inserted row. If there is no authenticated user, it throws a `TaskError` before attempting the insert (fail fast, matching the "Create task without an authenticated user" spec scenario) rather than relying solely on the RLS `WITH CHECK` to reject it.
- **RLS: one policy per operation on `tasks`**, replacing "Allow all for now":
  - `SELECT`/`UPDATE`/`DELETE`: `USING (auth.uid() = user_id)`
  - `INSERT`: `WITH CHECK (auth.uid() = user_id)`
  - `UPDATE` additionally needs `WITH CHECK (auth.uid() = user_id)` so a row can't be re-pointed to another user's id.
  Four narrow policies (one per operation) are chosen over one broad `FOR ALL` policy so each operation's condition is explicit and easy to audit.
- **Migration assumes the `tasks` table is currently empty** (it has only held manual test/dev rows so far — see [[tasks-crud]]). The migration adds `user_id UUID REFERENCES auth.users(id) NOT NULL` directly; no default value, no backfill step. This is safe now and avoids building throwaway backfill logic for data that has no valid owning user anyway (auth didn't exist yet). If real rows exist when this runs, the migration will fail on the `NOT NULL` constraint — see Risks below.

## Risks / Trade-offs

- [Adding `user_id NOT NULL` fails if `tasks` has any existing rows] → Mitigation: verify the table is empty (`select count(*) from tasks`) immediately before running the migration; if not, stop and decide with the user whether to delete dev rows or write a backfill (out of scope otherwise).
- [Fail-fast check in `createTask` and the RLS `WITH CHECK` are two places enforcing "must have a user"] → Accepted duplication: the client-side check gives a fast, clear `TaskError` in the common case; RLS remains the actual security boundary if the client-side check is ever bypassed or wrong.
- [`useSession`'s `onAuthStateChange` subscription must be unsubscribed on unmount] → Mitigation: return the unsubscribe function from the hook's `useEffect` cleanup; covered by a task in tasks.md.
- [No password recovery/email verification in this change] → Acceptable per proposal's explicit scope; users who mistype a password or lose access have no self-service recovery yet.
