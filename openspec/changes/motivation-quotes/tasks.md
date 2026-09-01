## 1. Phrase data

- [ ] 1.1 Create `src/lib/motivationalPhrases.ts` exporting a `const PHRASES: string[]` with 30-50 short, warm, non-cheesy Spanish phrases
- [ ] 1.2 Add `pickRandomPhrase(): string` to the same module

## 2. Phrase display component

- [ ] 2.1 Create `src/components/MotivationalPhrase.tsx`: renders the given phrase text (or nothing when there is none) inside a small pastel badge/card
- [ ] 2.2 Create `src/components/MotivationalPhrase.css` with the enter/exit transition (short fade/slide, ~200ms) using existing pastel tokens from `TasksView.css`

## 3. Wire into TasksView

- [ ] 3.1 Add local state to `TasksView` for the current phrase (e.g. `{ text: string; key: number } | null`) and a ref/id for the active dismissal timer
- [ ] 3.2 On the task completion click handler, pick a phrase via `pickRandomPhrase()`, set it as current, and (re)start a ~3.5s dismissal timeout that clears the phrase
- [ ] 3.3 Add a `useEffect` on `taskErrors` (from `useTasks`) that clears the currently shown phrase if it was shown for a task id that now has an error, without changing `useTasks.ts`
- [ ] 3.4 Render `<MotivationalPhrase>` with the current phrase state
- [ ] 3.5 Clear the dismissal timeout on component unmount

## 4. Verification

- [ ] 4.1 Run the app, sign in, and complete a task — confirm a phrase appears in the same interaction as the checkbox completing (no loader, no delay)
- [ ] 4.2 Confirm the phrase auto-dismisses after a few seconds when no other task is completed
- [ ] 4.3 Complete two tasks in quick succession (before the first phrase dismisses) and confirm the second phrase replaces the first, timer restarted
- [ ] 4.4 Visually confirm the enter/exit animation is short and subtle and uses only the existing pastel palette
- [ ] 4.5 Confirm phrases vary across multiple completions (not always the same one)
- [ ] 4.6 Force a completion failure (e.g. attempt to complete a task id owned by a different test account, so the RLS-backed update fails) and confirm no phrase remains shown once `taskErrors` reflects the failure
- [ ] 4.7 Clean up any test task rows created during verification
