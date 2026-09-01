## 1. Data hook

- [x] 1.1 Create `src/hooks/useTasks.ts`: loads today's tasks via `listTodaysTasks()` on mount into local state, exposes `{ tasks, loading, error }`
- [x] 1.2 Add `addTask(title: string)` to the hook: calls `createTask(title)` and appends the returned row to local `tasks` on success; surfaces an error on failure without touching existing tasks
- [x] 1.3 Add `completeTask(id: string)` to the hook: optimistically marks the matching local task `completed = true` immediately, then calls `completeTask` from `src/lib/tasks.ts`; on success replaces the local row with the returned row, on failure reverts that row to its prior state and surfaces an error scoped to that task

## 2. Tasks view component

- [x] 2.1 Create `src/components/TasksView.tsx` using `useTasks`
- [x] 2.2 Render the quick-add input: controlled text input, Enter submits via `addTask` when non-empty/non-whitespace, clears immediately on submit
- [x] 2.3 Render today's task list from `tasks` (title + a completion control per task), including an empty state when there are no tasks yet
- [x] 2.4 Wire the completion control to call the hook's `completeTask(id)`, and disable/skip the action for tasks already completed
- [x] 2.5 Render the points counter as `tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0)`, always visible
- [x] 2.6 Render inline error messaging for a failed add or a failed complete, scoped to the input / the specific task respectively

## 3. Pastel styling

- [x] 3.1 Create `src/components/TasksView.css` with CSS custom properties for the pastel palette (light non-pure-white background, lavender/mint accents, dark-gray text) and apply them to `TasksView`'s markup
- [x] 3.2 Style the quick-add input, task rows, completion control, and points counter using only palette tokens (no saturated/vivid colors)

## 4. Wire into App shell

- [x] 4.1 Replace the Vite scaffold markup in `App.tsx` (hero image, framework links, counter demo, docs/social sections) with `<TasksView />`, keeping the existing logout button
- [x] 4.2 Remove the now-dead scaffold-specific rules from `App.css` (hero/ticks/next-steps/spacer etc.) that nothing renders anymore (every rule in `App.css` was scaffold-only, so the file itself was removed along with its import)
- [x] 4.3 Remove now-unused scaffold assets/imports (`heroImg`, `reactLogo`, `viteLogo` in `App.tsx`) if nothing else references them (imports removed from `App.tsx`; the unused asset files `hero.png`/`react.svg`/`vite.svg` were also deleted since nothing referenced them)

## 5. Verification

- [x] 5.1 Run the app, sign in with an existing test account, and confirm today's tasks load correctly
- [x] 5.2 Add a task via Enter in the quick-add input and confirm it appears immediately and the input clears
- [x] 5.3 Mark a task complete and confirm the visual state and points counter update immediately, without a full list reload
- [x] 5.4 Confirm the points counter equals the sum of completed tasks' `points`, including after adding/completing more than one task
- [x] 5.5 Confirm the view renders correctly with zero tasks for the day (empty state, counter at 0)
- [x] 5.6 Visually confirm the palette (background/accents/text) matches the pastel constraint (no pure white/black, no saturated colors)
- [x] 5.7 Clean up any test task rows created during verification
