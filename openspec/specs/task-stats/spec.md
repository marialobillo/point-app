# task-stats Specification

## Purpose

Lets the signed-in user see, for a chosen period (current week, current month, or current year), how many tasks they completed and how many points they earned in that period, as a quick totals-only overview.

## Requirements

### Requirement: Period selection
The system SHALL let the signed-in user select one of three periods for the stats view: current week, current month, or current year.

#### Scenario: Default period on load
- **WHEN** the stats view is first rendered
- **THEN** one of the three periods SHALL be selected by default and its totals SHALL be shown

#### Scenario: Switching period updates totals
- **WHEN** the user selects a different period
- **THEN** the displayed totals SHALL update to reflect the newly selected period

### Requirement: Period date ranges
The system SHALL compute each period as a rolling window ending today: current week SHALL cover the 7 days ending today, current month SHALL cover the days ending today equal in count to the number of days in the current calendar month, and current year SHALL cover the 365 days ending today.

#### Scenario: Week period range
- **WHEN** the current week period is selected
- **THEN** totals SHALL be computed from tasks dated within the 7 days ending today, inclusive of today

#### Scenario: Year period range
- **WHEN** the current year period is selected
- **THEN** totals SHALL be computed from tasks dated within the 365 days ending today, inclusive of today

### Requirement: Period totals
The system SHALL show, for the selected period, the total number of completed tasks and the total points earned (the sum of `points` across those completed tasks).

#### Scenario: Period has completed tasks
- **WHEN** the selected period contains one or more completed tasks
- **THEN** the displayed total completed count SHALL equal the number of completed tasks in that period
- **AND** the displayed total points SHALL equal the sum of `points` for those completed tasks

#### Scenario: Period has no completed tasks
- **WHEN** the selected period contains no completed tasks
- **THEN** the displayed total completed count SHALL be 0 and the displayed total points SHALL be 0

### Requirement: Low-stimulation pastel visual style
The system SHALL present the stats view using the same muted, pastel palette as the rest of the app: a non-pure-white/black background, muted accent colors, and no saturated/vivid colors.

#### Scenario: Palette constraints hold
- **WHEN** the stats view is rendered
- **THEN** its background, accent, and text colors SHALL be pastel/muted tones, not pure white (#fff), pure black (#000), or highly saturated colors
