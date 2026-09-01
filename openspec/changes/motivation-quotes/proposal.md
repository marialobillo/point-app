## Why

Completing a task in the tasks view (`TasksView`) already gives instant visual feedback (checkbox + points counter), but there's no warmth to it — no small reward for the person actually doing the task. A short, hardcoded motivational phrase on completion adds that positive reinforcement without needing any backend support.

## What Changes

- Add a hardcoded array (in Spanish, 30-50 phrases) of short, warm, non-cheesy motivational phrases — no Supabase table, no API call.
- When a task is marked complete in `TasksView`, pick one phrase at random and display it.
- The phrase appears at the same instant the task's completed state shows (piggybacking on the existing optimistic UI in `useTasks`), with no loader or artificial delay.
- The phrase auto-dismisses after a few seconds, and is naturally replaced if another task is completed before it dismisses.
- A short, subtle enter/exit animation for the phrase, consistent with the existing pastel palette (`TasksView.css`) — no abrupt motion, no saturated colors.

## Capabilities

### New Capabilities
- `motivational-feedback`: Shows a random hardcoded motivational phrase, with a pastel-consistent transition, immediately when a task is completed.

### Modified Capabilities
- None. `tasks-ui`'s existing completion behavior (immediate visual feedback, points counter) is unchanged; this only adds a new, separate piece of feedback triggered by the same event.

## Impact

- `src/components/TasksView.tsx`: reads the outcome of the existing `completeTask` call (no change to `useTasks.ts` or `src/lib/tasks.ts` beyond that) to decide when to show a phrase.
- New module for the phrase list and the phrase-display piece (component and/or data file) under `src/components/` or `src/lib/`.
- New CSS for the phrase's enter/exit animation, extending the existing pastel palette tokens.
- Out of scope: AI-generated or task-specific phrases, and tracking/persisting which phrases have already been shown.
