# tasks-ui Specification

## Purpose

Gives the signed-in user a low-friction view of today's tasks: see them, add one in a single keystroke flow, mark one done with instant visual feedback, and see today's earned points at a glance.

## Requirements

### Requirement: Today's task list
The system SHALL display the signed-in user's tasks for today after login.

#### Scenario: Tasks exist for today
- **WHEN** the signed-in user has one or more tasks for today
- **THEN** each of those tasks SHALL be visible in the list, showing at least its title, points, and completion state

#### Scenario: No tasks yet today
- **WHEN** the signed-in user has no tasks for today
- **THEN** the view SHALL render without error and without any task rows (an empty list, not a loading state stuck indefinitely)

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

### Requirement: Quick-add task
The system SHALL let the signed-in user add a task to today's list by typing a title and pressing Enter, without opening a modal or dialog.

#### Scenario: Add a task
- **WHEN** the user types a non-empty title into the quick-add input and presses Enter
- **THEN** a new task SHALL be created for today with that title
- **AND** the new task SHALL appear in the visible task list
- **AND** the input SHALL be cleared and ready for the next entry

#### Scenario: Empty input
- **WHEN** the user presses Enter with an empty or whitespace-only input
- **THEN** no task SHALL be created

### Requirement: Mark task complete with immediate feedback
The system SHALL let the user mark a visible task as complete, and SHALL reflect that task's completed state in the UI immediately, without waiting for a full re-fetch of the task list.

#### Scenario: Complete a task
- **WHEN** the user marks an incomplete task as complete
- **THEN** that task SHALL be visually shown as completed right away (e.g. within the same interaction, not after a subsequent full list reload)
- **AND** the underlying task record SHALL be updated to completed

#### Scenario: Completion request fails
- **WHEN** marking a task complete fails (the underlying update errors)
- **THEN** the UI SHALL reflect that the task did not complete (not silently show it as completed while the record is unchanged)

### Requirement: Daily points counter
The system SHALL display, at all times while viewing today's tasks, the sum of `points` for today's tasks that are completed.

#### Scenario: Counter reflects completed tasks
- **WHEN** the signed-in user has completed one or more tasks today
- **THEN** the displayed count SHALL equal the sum of those completed tasks' `points`

#### Scenario: Counter updates on completion
- **WHEN** the user marks another task as complete
- **THEN** the displayed count SHALL increase by that task's `points` without requiring a page reload

#### Scenario: No completed tasks yet
- **WHEN** the signed-in user has no completed tasks today
- **THEN** the displayed count SHALL be 0

### Requirement: Low-stimulation pastel visual style
The system SHALL present the tasks view using a muted, pastel palette: a light, non-pure-white background, lavender/mint pastel accent colors, and dark-gray (not pure black) body text, with no saturated/vivid colors.

#### Scenario: Palette constraints hold
- **WHEN** the tasks view is rendered
- **THEN** its background, accent, and text colors SHALL be pastel/muted tones as described, not pure white (#fff), pure black (#000), or highly saturated colors
