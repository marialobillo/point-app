# streak-tracking Specification

## Purpose

Gives the user a sense of momentum: how many days in a row they've gotten at least one task done, shown alongside today's points so it's visible without navigating anywhere.

## Requirements

### Requirement: Current streak calculation
The system SHALL compute the current streak as the number of consecutive days, ending at today or yesterday, on which the signed-in user completed at least one task.

#### Scenario: Streak includes today
- **WHEN** today has at least one completed task, and the immediately preceding N-1 days also each have at least one completed task with no gap
- **THEN** the current streak SHALL be N

#### Scenario: Streak counts up to yesterday when today has no completion yet
- **WHEN** today has no completed task yet, but yesterday and some number of consecutive days before it each have at least one completed task with no gap
- **THEN** the current streak SHALL be that consecutive count ending at yesterday (today not yet breaking it)

#### Scenario: Gap breaks the streak
- **WHEN** there is a day with no completed task between today (or yesterday) and an earlier run of completed days
- **THEN** the current streak SHALL only count the unbroken run ending at today or yesterday, not days before the gap

#### Scenario: No completed tasks at all
- **WHEN** the signed-in user has no completed tasks on today or yesterday
- **THEN** the current streak SHALL be 0

### Requirement: Display current streak
The system SHALL display the current streak count in the today view, visible alongside the daily points counter.

#### Scenario: Streak is visible
- **WHEN** the today view is rendered
- **THEN** the current streak count SHALL be visible without requiring navigation to another view
