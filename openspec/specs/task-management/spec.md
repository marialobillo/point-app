# task-management Specification

## Purpose

Provides typed, reusable data-access operations for creating, reading, updating, and deleting task records stored in the Supabase `tasks` table.

## Requirements

### Requirement: Task type definition
The system SHALL expose a `Task` TypeScript interface whose fields match the `tasks` table schema: `id` (string/UUID), `title` (string), `points` (number), `completed` (boolean), `task_date` (string, ISO date), `completed_at` (string or null, ISO timestamp), `created_at` (string, ISO timestamp), `user_id` (string/UUID, the owning user).

#### Scenario: Type reflects table schema
- **WHEN** a task row is fetched from Supabase
- **THEN** its shape SHALL be assignable to the `Task` interface without using `any` or type assertions to bypass mismatches

#### Scenario: Type includes owning user
- **WHEN** a task row is fetched from Supabase
- **THEN** the `Task` value SHALL include a `user_id` identifying the user who owns it

### Requirement: Create task
The system SHALL provide a function to create a task given a `title` and an optional `points` value, associated with the currently authenticated user.

#### Scenario: Create task with explicit points
- **WHEN** the function is called with a `title` and a `points` value by an authenticated user
- **THEN** a new row SHALL be inserted into `tasks` with that `title`, `points`, and `user_id` set to the current authenticated user's id
- **AND** the created `Task` (including generated `id` and `created_at`) SHALL be returned

#### Scenario: Create task without points uses default
- **WHEN** the function is called with only a `title` by an authenticated user
- **THEN** the inserted row SHALL use `points = 10`

#### Scenario: Create task without an authenticated user
- **WHEN** the function is called while there is no authenticated Supabase session
- **THEN** the function SHALL surface an error to the caller instead of inserting a row with a missing or invalid `user_id`

#### Scenario: Create task fails
- **WHEN** the Supabase insert returns an error (including an RLS policy rejection)
- **THEN** the function SHALL surface the error to the caller instead of returning as if it succeeded

### Requirement: List today's tasks
The system SHALL provide a function that returns the authenticated user's own tasks whose `task_date` equals the current date.

#### Scenario: Tasks exist for today
- **WHEN** the function is called on a date where the current user has one or more tasks with `task_date` equal to today
- **THEN** it SHALL return exactly those tasks and no tasks from other dates or other users

#### Scenario: No tasks for today
- **WHEN** the function is called and the current user has no tasks with `task_date` equal to today
- **THEN** it SHALL return an empty list, not an error

#### Scenario: List fails
- **WHEN** the Supabase query returns an error
- **THEN** the function SHALL surface the error to the caller instead of returning an empty list silently

### Requirement: Complete task
The system SHALL provide a function to mark one of the authenticated user's own tasks as completed by its `id`.

#### Scenario: Mark task completed
- **WHEN** the function is called with the `id` of an incomplete task owned by the current user
- **THEN** the row SHALL be updated with `completed = true` and `completed_at` set to the current timestamp
- **AND** the updated `Task` SHALL be returned

#### Scenario: Complete fails
- **WHEN** the Supabase update returns an error, or matches no row (including because the `id` belongs to another user)
- **THEN** the function SHALL surface the error to the caller

### Requirement: Edit task
The system SHALL provide a function to update the `title` and/or `points` of one of the authenticated user's own tasks by its `id`.

#### Scenario: Edit title and points
- **WHEN** the function is called with the `id` of a task owned by the current user and new `title` and/or `points` values
- **THEN** only the provided fields SHALL be updated on that row
- **AND** the updated `Task` SHALL be returned

#### Scenario: Edit fails
- **WHEN** the Supabase update returns an error, or matches no row (including because the `id` belongs to another user)
- **THEN** the function SHALL surface the error to the caller

### Requirement: Delete task
The system SHALL provide a function to delete one of the authenticated user's own tasks by its `id`.

#### Scenario: Delete existing task
- **WHEN** the function is called with the `id` of an existing task owned by the current user
- **THEN** the row SHALL be removed from `tasks`

#### Scenario: Delete a task owned by another user
- **WHEN** the function is called with the `id` of a task that exists but is owned by a different user
- **THEN** no row SHALL be removed from `tasks`

#### Scenario: Delete fails
- **WHEN** the Supabase delete returns an error
- **THEN** the function SHALL surface the error to the caller

### Requirement: Explicit error surfacing
Every data-access function in this capability SHALL check the Supabase response for an error and propagate it (via throw or a typed error return) rather than ignoring it.

#### Scenario: Supabase error is never silently swallowed
- **WHEN** any create, list, complete, edit, or delete operation receives an error from Supabase
- **THEN** the calling code SHALL be able to detect the failure programmatically (e.g. a thrown error or a non-null error field), not just via a console log
