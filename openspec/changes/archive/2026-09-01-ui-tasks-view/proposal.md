## Why

The task data layer (`src/lib/tasks.ts`) and auth (`AuthGate`/`AuthScreen`) are already working, but `App.tsx` still shows the default Vite scaffold behind the login. There is no way to actually see or add today's tasks yet.

## What Changes

- Replace the scaffold content in `App.tsx` (inside `AuthGate`) with the real daily tasks view.
- Show today's tasks (via `listTodaysTasks`).
- A frictionless quick-add: a single text input, Enter to create a task (via `createTask`), no modal.
- A way to mark a task complete (via `completeTask`) with an immediate visual update, no waiting on a full list refetch.
- An always-visible counter of today's earned points (sum of `points` for today's completed tasks).
- A light pastel visual style: off-white background, lavender/mint pastel accents, dark-gray (not pure black) text, no saturated colors.
- Interaction is optimized for low friction and instant visual feedback on completing a task — the person using this app has ADHD, so the reward needs to feel immediate, not gated behind a loading state.

## Capabilities

### New Capabilities
- `tasks-ui`: The daily tasks view — listing today's tasks, quick-add, marking complete with optimistic/immediate feedback, and a live daily points counter.

### Modified Capabilities
- None. This change only adds a UI on top of the existing `task-management` data layer; it doesn't change any of its requirements.

## Impact

- `src/App.tsx`: scaffold content replaced with the tasks view (still wrapped by `AuthGate`).
- New component(s) under `src/components/` for the task list, quick-add input, and points counter.
- New/updated styling (pastel palette) — likely a new stylesheet or replacing `App.css`'s scaffold rules.
- Out of scope: completion messages/motivational phrases (block 4), editing/deleting tasks from the UI, and any view of days other than today.
