## ADDED Requirements

### Requirement: List tasks in a date range
The system SHALL provide a function to fetch the authenticated user's own tasks whose `task_date` falls within a given inclusive date range.

#### Scenario: Tasks exist within the range
- **WHEN** the function is called with a `fromDate` and `toDate` and the current user has tasks with `task_date` on or between those dates
- **THEN** it SHALL return exactly those tasks, and no tasks with `task_date` outside the range or belonging to other users

#### Scenario: No tasks in the range
- **WHEN** the function is called with a range containing no tasks for the current user
- **THEN** it SHALL return an empty list, not an error

#### Scenario: Range query fails
- **WHEN** the Supabase query returns an error
- **THEN** the function SHALL surface the error to the caller instead of returning an empty list silently
