## Purpose

Gives the user a small, warm reward the instant they complete a task: a randomly chosen motivational phrase that appears and fades on its own, without slowing down or complicating the completion flow.

## ADDED Requirements

### Requirement: Motivational phrase pool
The system SHALL maintain a hardcoded collection of at least 30 distinct short motivational phrases in Spanish, each with a warm, friendly, positive tone that is neither cheesy nor childish.

#### Scenario: Pool is available at runtime
- **WHEN** the app needs to show a motivational phrase
- **THEN** it SHALL be able to pick one from a pool of at least 30 phrases without any network request

### Requirement: Show a phrase on task completion
The system SHALL display one randomly selected phrase from the pool when a task is successfully marked complete.

#### Scenario: Task completed successfully
- **WHEN** the user marks a task as complete and the completion succeeds
- **THEN** a motivational phrase SHALL be shown, chosen at random from the phrase pool

#### Scenario: Task completion fails
- **WHEN** the user marks a task as complete but the underlying completion fails (the task reverts to incomplete)
- **THEN** no motivational phrase SHALL remain shown for that attempt

### Requirement: Immediate display, no artificial delay
The system SHALL show the motivational phrase at the same moment the task's completed state becomes visible, with no loading indicator and no artificial delay before it appears.

#### Scenario: Phrase appears with the completed state
- **WHEN** a task is marked complete
- **THEN** the phrase SHALL become visible in the same interaction as the task's checked/completed visual state, not after a subsequent reload or delay

### Requirement: Auto-dismiss
The system SHALL automatically hide a shown motivational phrase after a short delay, and SHALL replace it immediately if another task is completed before it has dismissed.

#### Scenario: Phrase dismisses on its own
- **WHEN** a motivational phrase has been shown and no further task is completed
- **THEN** it SHALL disappear on its own after a few seconds, without requiring user interaction

#### Scenario: Phrase replaced by a new completion
- **WHEN** a motivational phrase is currently shown and the user completes another task before it has dismissed
- **THEN** the shown phrase SHALL be replaced by a newly chosen phrase for that completion

### Requirement: Pastel-consistent transition
The system SHALL animate the phrase's appearance and disappearance with a short, subtle transition using the existing pastel palette — no abrupt motion and no saturated colors.

#### Scenario: Transition matches the palette
- **WHEN** the phrase appears or disappears
- **THEN** the animation SHALL be brief and subtle, and any colors it uses SHALL come from the existing pastel palette, not a new saturated/vivid color
