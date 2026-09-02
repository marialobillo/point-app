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
  user_id: string
}

export class TaskError extends Error {
  cause: PostgrestError | Error

  constructor(message: string, cause: PostgrestError | Error) {
    super(message)
    this.name = 'TaskError'
    this.cause = cause
  }
}

const DEFAULT_POINTS = 10

function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayLocalDate(): string {
  return formatLocalDate(new Date())
}

export function lastNDaysRange(n: number): { fromDate: string; toDate: string } {
  const today = new Date()
  const from = new Date(today)
  from.setDate(from.getDate() - (n - 1))
  return { fromDate: formatLocalDate(from), toDate: formatLocalDate(today) }
}

export type StatsPeriod = 'week' | 'month' | 'year'

function daysInCurrentMonth(): number {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
}

export function periodRange(period: StatsPeriod): { fromDate: string; toDate: string } {
  switch (period) {
    case 'week':
      return lastNDaysRange(7)
    case 'month':
      return lastNDaysRange(daysInCurrentMonth())
    case 'year':
      return lastNDaysRange(365)
  }
}

export async function createTask(title: string, points: number = DEFAULT_POINTS): Promise<Task> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw new TaskError(`Failed to create task: ${userError.message}`, userError)
  }
  if (!user) {
    throw new TaskError('Failed to create task: no authenticated user', new Error('No authenticated user'))
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, points, user_id: user.id })
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

export async function listTasksInRange(fromDate: string, toDate: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select()
    .gte('task_date', fromDate)
    .lte('task_date', toDate)

  if (error) {
    throw new TaskError(`Failed to list tasks in range: ${error.message}`, error)
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

export async function uncompleteTask(id: string): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed: false, completed_at: null })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new TaskError(error.message, error)
  return data
}