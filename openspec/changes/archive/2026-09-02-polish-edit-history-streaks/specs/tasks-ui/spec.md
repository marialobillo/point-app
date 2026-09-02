## MODIFIED Requirements

### Requirement: Today's task list
The system SHALL display the signed-in user's tasks for today after login.

#### Scenario: Tasks exist for today
- **WHEN** the signed-in user has one or more tasks for today
- **THEN** each of those tasks SHALL be visible in the list, showing at least its title, points, and completion state

#### Scenario: No tasks yet today
- **WHEN** the signed-in user has no tasks for today
- **THEN** the view SHALL render without error and without any task rows (an empty list, not a loading state stuck indefinitely)

## ADDED Requirements

### Requirement: Edit task points inline
The system SHALL let the user edit a visible task's points value directly in the today list, without opening a modal or navigating away, and SHALL reflect the new value immediately without waiting for a full re-fetch of the task list.

#### Scenario: Edit points successfully
- **WHEN** the user activates editing on a task's points value, enters a new numeric value, and confirms (e.g. presses Enter or moves focus away)
- **THEN** the task's displayed points value SHALL update right away
- **AND** the underlying task record SHALL be updated with the new points value

#### Scenario: Edit points request fails
- **WHEN** saving an edited points value fails (the underlying update errors)
- **THEN** the displayed points value SHALL revert to what it was before the edit, not remain showing the unsaved value

#### Scenario: Cancel without saving
- **WHEN** the user leaves the points value unchanged, or the entered value is not a valid number
- **THEN** no update SHALL be sent and the task's points value SHALL remain as it was
