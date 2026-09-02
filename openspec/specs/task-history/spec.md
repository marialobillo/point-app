# task-history Specification

## Purpose

Lets the user look back at past days: which days had tasks, what those tasks were, and how many points were earned that day. Read-only — history is for looking, not editing.

## Requirements

### Requirement: List past days with tasks
The system SHALL let the user see which past days (before today) have at least one task, so they can pick one to view.

#### Scenario: Past days exist
- **WHEN** the signed-in user has tasks on one or more days before today
- **THEN** those days SHALL be selectable in the history view

#### Scenario: No past days
- **WHEN** the signed-in user has no tasks on any day before today
- **THEN** the history view SHALL indicate there is no history yet, without error

### Requirement: View a past day's tasks and total
The system SHALL show, for a selected past day, that day's tasks (at least title, points, and completion state) and the total points from that day's completed tasks.

#### Scenario: View a day with tasks
- **WHEN** the user selects a past day that has tasks
- **THEN** the view SHALL list that day's tasks and show the sum of `points` for that day's completed tasks

### Requirement: History is read-only
The system SHALL NOT let the user complete, edit, or delete a task from the history view.

#### Scenario: No completion or edit controls in history
- **WHEN** the user is viewing a past day's tasks in the history view
- **THEN** no control to mark a task complete, edit its points, or delete it SHALL be present in that view
