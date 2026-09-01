## 1. Database migration

- [x] 1.1 Confirm the `tasks` table is currently empty (`select count(*) from tasks`); stop and check with the user if it is not
- [x] 1.2 Write and apply a SQL migration: `alter table tasks add column user_id uuid references auth.users(id) not null`
- [x] 1.3 Drop the existing "Allow all for now" policy on `tasks`
- [x] 1.4 Add `SELECT`/`DELETE` policies with `USING (auth.uid() = user_id)`
- [x] 1.5 Add an `INSERT` policy with `WITH CHECK (auth.uid() = user_id)`
- [x] 1.6 Add an `UPDATE` policy with `USING (auth.uid() = user_id)` and `WITH CHECK (auth.uid() = user_id)`

## 2. Auth data layer

- [x] 2.1 Create `src/lib/auth.ts` with an `AuthError` class (same shape as `TaskError` in `src/lib/tasks.ts`)
- [x] 2.2 Implement `signUp(email: string, password: string): Promise<Session | null>` using `supabase.auth.signUp`, throwing `AuthError` on failure
- [x] 2.3 Implement `signIn(email: string, password: string): Promise<Session>` using `supabase.auth.signInWithPassword`, throwing `AuthError` on failure
- [x] 2.4 Implement `signOut(): Promise<void>` using `supabase.auth.signOut`, throwing `AuthError` on failure
- [x] 2.5 Implement `getSession(): Promise<Session | null>` using `supabase.auth.getSession`

## 3. Session hook and gating component

- [x] 3.1 Create `src/hooks/useSession.ts`: calls `getSession()` on mount, subscribes to `supabase.auth.onAuthStateChange`, unsubscribes on unmount, exposes `{ session, loading }`
- [x] 3.2 Create a minimal `AuthScreen` component (`src/components/AuthScreen.tsx`) with email/password inputs, a submit button, and a toggle between sign-up and log-in modes — functional only, no visual design
- [x] 3.3 Create an `AuthGate` component (`src/components/AuthGate.tsx`) that uses `useSession`: renders nothing while loading, `AuthScreen` when there's no session, and its `children` when there is one
- [x] 3.4 Wrap `App.tsx`'s existing content with `AuthGate` and add a basic logout button (calls `signOut()`) when authenticated, without otherwise changing the scaffold content

## 4. Update task-management data layer for ownership

- [x] 4.1 Add `user_id: string` to the `Task` interface in `src/lib/tasks.ts`
- [x] 4.2 Update `createTask` to resolve the current user via `supabase.auth.getUser()`, throw `TaskError` immediately if there is none, and include `user_id` in the insert payload
- [x] 4.3 Re-read `listTodaysTasks`, `completeTask`, `editTask`, `deleteTask` and confirm none of them need code changes now that RLS scopes rows by `user_id` (no client-side filtering added)

## 5. Verification

- [x] 5.1 Manually sign up a first test user and confirm `createTask` succeeds and sets `user_id` to that user
- [x] 5.2 Manually sign up a second test user and confirm `listTodaysTasks` for user 2 does not return user 1's tasks
- [x] 5.3 Confirm `completeTask`/`editTask`/`deleteTask` called by user 2 against user 1's task id fail to affect the row (per the "Delete a task owned by another user" / "Complete fails" / "Edit fails" scenarios)
- [x] 5.4 Confirm `createTask` throws when called with no authenticated session
- [x] 5.5 Confirm logging out clears the session and `AuthGate` shows `AuthScreen` again
- [x] 5.6 Delete the test users/rows created during verification (test task rows deleted; the two test user accounts are intentionally kept as reusable dev accounts per user's decision)
