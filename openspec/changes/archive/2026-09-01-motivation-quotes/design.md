## Context

`useTasks.completeTask(id)` (see [[tasks-ui]]) already updates local state optimistically before awaiting the network call, and exposes `taskErrors: Record<string, string>` which gets set (and the optimistic change reverted) if the completion fails. `TasksView` currently calls it fire-and-forget: `onChange={() => completeTask(task.id)}`. The proposal explicitly puts any further change to `useTasks.ts`/`src/lib/tasks.ts` out of scope beyond reading `completeTask`'s existing result — so all new logic here lives in the view layer.

## Goals / Non-Goals

**Goals:**
- Trigger the phrase the instant the checkbox visually flips to completed, not after the network round-trip.
- Never leave a phrase shown for a completion that ultimately failed.

**Non-Goals:**
- No changes to `useTasks.ts` or `src/lib/tasks.ts` internals or return signatures.
- No phrase queueing/history — always exactly zero or one phrase visible at a time.

## Decisions

- **The phrase is chosen and shown synchronously inside `TasksView`'s completion click handler**, at the same point the checkbox click fires — not inside `useTasks`. This is what "immediate, no artificial delay" means here: the phrase doesn't wait on the `completeTask` promise at all, it appears in the same tick as the optimistic checkbox state.
- **A `useEffect` watching `taskErrors` clears the currently shown phrase if the just-completed task's id appears in `taskErrors`.** This is the "reading the existing result of `completeTask`" the proposal allows: `taskErrors` is already computed and exposed by the hook today, so reacting to it needs zero hook changes. This satisfies "no phrase remains shown for a failed completion" without threading any new return value through `completeTask`.
- **Dismissal is a single `setTimeout` (e.g. 3.5s), reset on every new completion.** Storing the phrase in one piece of component state (`{ text, key }` or similar) and setting a fresh timeout each time a task completes gives both required behaviors for free: it disappears on its own if nothing else happens, and a new completion naturally overwrites the state and restarts the timer — no separate "replace" code path needed. This is simpler than tracking "was replaced by a newer completion" as a distinct case.
- **New module `src/lib/motivationalPhrases.ts`** exports the phrase array and a `pickRandomPhrase()` helper — kept as plain data/logic, no React, so it's trivial to read and extend later.
- **New component `src/components/MotivationalPhrase.tsx`** renders the current phrase (or nothing) and owns the CSS transition classes; `TasksView` holds the phrase state and passes it down, keeping `TasksView` itself from growing an animation-details concern.
- **Animation via CSS transition on mount/unmount, not a library.** A phrase mounts (fade/slide in over ~200ms) and unmounts (fade out over ~200ms) using existing pastel tokens from `TasksView.css` (e.g. `--tv-accent-mint`/`--tv-accent-lavender` background, `--tv-text` for the text) — this is a small enough interaction to not warrant pulling in an animation library.

## Risks / Trade-offs

- [Reacting to `taskErrors` via `useEffect` runs one render after the error is set, so the phrase clears one tick after appearing rather than never appearing] → Acceptable: completion failures are rare (see [[task-management]] error scenarios), and a phrase flashing for a fraction of a second before clearing is a minor cosmetic edge case, not a functional one.
- [Timer-based dismissal means a very fast user completing many tasks in under 3.5s only ever sees the latest phrase] → Accepted per design goal: there is intentionally at most one phrase visible at a time.
