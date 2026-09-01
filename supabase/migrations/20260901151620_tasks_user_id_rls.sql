-- Adds per-user ownership to tasks and replaces the open RLS policy with
-- per-operation, per-user policies. Assumes `tasks` is currently empty
-- (verified before writing this migration) since user_id is NOT NULL with
-- no default/backfill.

alter table tasks
  add column user_id uuid references auth.users(id) not null;

drop policy if exists "Allow all for now" on tasks;

create policy "Users can select their own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on tasks for delete
  using (auth.uid() = user_id);
