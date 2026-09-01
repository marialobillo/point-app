## 1. Module setup

- [x] 1.1 Create `src/lib/tasks.ts` importing the existing `supabase` client from `src/supabaseClient.ts`
- [x] 1.2 Define the `Task` interface (`id`, `title`, `points`, `completed`, `task_date`, `completed_at`, `created_at`) matching the `tasks` table schema
- [x] 1.3 Define a `TaskError` class (extends `Error`) that wraps the underlying Supabase/Postgrest error

## 2. Create and list

- [x] 2.1 Implement `createTask(title: string, points?: number): Promise<Task>` — inserts a row with `points` defaulting to 10 when omitted, throws `TaskError` on failure, returns the inserted row
- [x] 2.2 Implement `listTodaysTasks(): Promise<Task[]>` — computes today's local date as `YYYY-MM-DD`, queries `tasks` where `task_date` equals it, throws `TaskError` on failure, returns `[]` when no rows match

## 3. Update operations

- [x] 3.1 Implement `completeTask(id: string): Promise<Task>` — updates `completed = true` and `completed_at = new Date().toISOString()` for the given `id`, throws `TaskError` on failure or no matching row
- [x] 3.2 Implement `editTask(id: string, updates: { title?: string; points?: number }): Promise<Task>` — updates only the provided fields, throws `TaskError` on failure or no matching row

## 4. Delete

- [x] 4.1 Implement `deleteTask(id: string): Promise<void>` — deletes the row by `id`, throws `TaskError` on failure

## 5. Verification

- [x] 5.1 Manually exercise each function against the live Supabase `tasks` table (create, list today, complete, edit, delete) and confirm rows change as expected
- [x] 5.2 Confirm a forced Supabase error (e.g. invalid `id`) results in a thrown `TaskError` for each function, not a silent failure
