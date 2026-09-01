// src/lib/tasks.ts
import type { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'

export interface Task {
  id: string
  title: string
  points: number
  completed: boolean
  task_date: string
  completed_at: string | null
  created_at: string
}

export class TaskError extends Error {
  cause: PostgrestError

  constructor(message: string, cause: PostgrestError) {
    super(message)
    this.name = 'TaskError'
    this.cause = cause
  }
}

const DEFAULT_POINTS = 10

function todayLocalDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function createTask(title: string, points: number = DEFAULT_POINTS): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, points })
    .select()
    .single()

  if (error) {
    throw new TaskError(`Failed to create task: ${error.message}`, error)
  }

  return data as Task
}

export async function listTodaysTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select()
    .eq('task_date', todayLocalDate())

  if (error) {
    throw new TaskError(`Failed to list today's tasks: ${error.message}`, error)
  }

  return (data ?? []) as Task[]
}

export async function completeTask(id: string): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed: true, completed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new TaskError(`Failed to complete task ${id}: ${error.message}`, error)
  }

  return data as Task
}

export async function editTask(
  id: string,
  updates: { title?: string; points?: number },
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new TaskError(`Failed to edit task ${id}: ${error.message}`, error)
  }

  return data as Task
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id)

  if (error) {
    throw new TaskError(`Failed to delete task ${id}: ${error.message}`, error)
  }
}
