import { useEffect, useState } from 'react'
import {
  completeTask as completeTaskRequest,
  createTask,
  listTodaysTasks,
  TaskError,
  type Task,
} from '../lib/tasks'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [addError, setAddError] = useState<string | null>(null)
  const [taskErrors, setTaskErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    listTodaysTasks()
      .then(setTasks)
      .catch((err) => setLoadError(err instanceof TaskError ? err.message : 'Failed to load tasks'))
      .finally(() => setLoading(false))
  }, [])

  async function addTask(title: string) {
    setAddError(null)
    try {
      const task = await createTask(title)
      setTasks((current) => [...current, task])
    } catch (err) {
      setAddError(err instanceof TaskError ? err.message : 'Failed to add task')
    }
  }

  async function completeTask(id: string) {
    const previous = tasks
    setTaskErrors((current) => {
      const rest = { ...current }
      delete rest[id]
      return rest
    })
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, completed: true } : t)))

    try {
      const updated = await completeTaskRequest(id)
      setTasks((current) => current.map((t) => (t.id === id ? updated : t)))
    } catch (err) {
      setTasks(previous)
      setTaskErrors((current) => ({
        ...current,
        [id]: err instanceof TaskError ? err.message : 'Failed to complete task',
      }))
    }
  }

  return { tasks, loading, loadError, addError, taskErrors, addTask, completeTask }
}
