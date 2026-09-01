## Why

The-point-app needs a data-access layer for tasks before any UI can be built. The `tasks` table already exists in Supabase and the Supabase client is already initialized, but there is no typed, reusable way in the codebase to create, read, update, or delete task rows.

## What Changes

- Add a `Task` TypeScript interface that mirrors the `tasks` table schema (`id`, `title`, `points`, `completed`, `task_date`, `completed_at`, `created_at`).
- Add typed functions (or a hook) to:
  - Create a task (`title` required, `points` optional, defaults to 10).
  - List tasks where `task_date` equals today.
  - Mark a task as completed (sets `completed = true` and `completed_at = now()`).
  - Edit a task's `title` and/or `points`.
  - Delete a task.
- Every function surfaces Supabase errors explicitly (throw or return a typed error) instead of letting a failed request pass silently.

## Capabilities

### New Capabilities
- `task-management`: Typed CRUD data-access functions for tasks backed by the Supabase `tasks` table (create, list today's tasks, complete, edit, delete), with explicit error handling.

### Modified Capabilities
- None.

## Impact

- New module(s) under `src/` (e.g. `src/lib/tasks.ts` or a `useTasks` hook) built on the existing `src/supabaseClient.ts`.
- No UI components are added or changed.
- No changes to authentication, Row Level Security, or the existing open policy.
- No changes to daily-points aggregation or motivational-message logic — out of scope for this change.
