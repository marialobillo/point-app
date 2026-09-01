## 1. Phrase data

- [x] 1.1 Create `src/lib/motivationalPhrases.ts` exporting a `const PHRASES: string[]` with 30-50 short, warm, non-cheesy Spanish phrases
- [x] 1.2 Add `pickRandomPhrase(): string` to the same module

## 2. Phrase display component

- [x] 2.1 Create `src/components/MotivationalPhrase.tsx`: renders the given phrase text (or nothing when there is none) inside a small pastel badge/card
- [x] 2.2 Create `src/components/MotivationalPhrase.css` with the enter/exit transition (short fade/slide, ~200ms) using existing pastel tokens from `TasksView.css`

## 3. Wire into TasksView

- [x] 3.1 Add local state to `TasksView` for the current phrase (`{ text, key, taskId } | null`) — implemented as one `useEffect` keyed on the phrase object instead of a manual timeout ref, since the project's react-hooks lint forbids ref reads/writes during render; the effect's cleanup naturally cancels the previous timer whenever a new phrase replaces it
- [x] 3.2 On the task completion click handler, pick a phrase via `pickRandomPhrase()`, set it as current, and (re)start a ~3.5s dismissal timeout that clears the phrase
- [x] 3.3 Clear the currently shown phrase if it was shown for a task id that now has an error — implemented as a render-time derived value (`visiblePhrase`) reading `taskErrors` rather than a `useEffect`, since the project's lint forbids synchronous `setState` in an effect body; behavior is identical (no phrase shown once the task errors), `useTasks.ts` untouched
- [x] 3.4 Render `<MotivationalPhrase>` with the current phrase state
- [x] 3.5 Clear the dismissal timeout on component unmount (covered by the same effect's cleanup from 3.1 — React runs it on unmount too, so no separate effect was needed)

## 4. Verification

- [x] 4.1 Run the app, sign in, and complete a task — confirm a phrase appears in the same interaction as the checkbox completing (no loader, no delay)
- [x] 4.2 Confirm the phrase auto-dismisses after a few seconds when no other task is completed
- [x] 4.3 Complete two tasks in quick succession (before the first phrase dismisses) and confirm the second phrase replaces the first, timer restarted
- [x] 4.4 Visually confirm the enter/exit animation is short and subtle and uses only the existing pastel palette
- [x] 4.5 Confirm phrases vary across multiple completions (not always the same one)
- [x] 4.6 Force a completion failure — implemented by monkey-patching `window.fetch` in the page to reject the completion PATCH request (a real foreign-user RLS test wasn't reachable through the UI, since it only ever lists the signed-in user's own tasks); confirmed the checkbox reverted, the existing inline error showed, and the phrase visibly exited and stayed gone
- [x] 4.7 Clean up any test task rows created during verification
