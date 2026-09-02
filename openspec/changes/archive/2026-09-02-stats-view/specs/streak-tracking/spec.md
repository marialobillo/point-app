## REMOVED Requirements

### Requirement: Current streak calculation
**Reason**: The daily-streak framing is being dropped in favor of period totals (see `task-stats`), which give a progress overview without pressure to avoid breaking a chain.
**Migration**: No replacement value is computed. Consumers previously reading the streak (e.g. `TasksView`) should remove that display; users who want a sense of progress can use the new Stats tab instead.

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
**Reason**: The streak is no longer computed, so it has nothing left to display.
**Migration**: Remove the streak display from the today view; no replacement UI element is required there.

#### Scenario: Streak is visible
- **WHEN** the today view is rendered
- **THEN** the current streak count SHALL be visible without requiring navigation to another view
