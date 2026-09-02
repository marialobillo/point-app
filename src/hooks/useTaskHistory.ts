import { useEffect, useState } from 'react'
import { lastNDaysRange, listTasksInRange, todayLocalDate, TaskError, type Task } from '../lib/tasks'

const HISTORY_WINDOW_DAYS = 60

export interface DayGroup {
  date: string
  tasks: Task[]
  totalPoints: number
}

export function useTaskHistory() {
  const [days, setDays] = useState<DayGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { fromDate, toDate } = lastNDaysRange(HISTORY_WINDOW_DAYS)
    const today = todayLocalDate()

    listTasksInRange(fromDate, toDate)
      .then((tasks) => {
        const grouped = new Map<string, Task[]>()
        for (const task of tasks) {
          if (task.task_date === today) continue
          const existing = grouped.get(task.task_date)
          if (existing) {
            existing.push(task)
          } else {
            grouped.set(task.task_date, [task])
          }
        }

        const dayGroups: DayGroup[] = Array.from(grouped.entries())
          .map(([date, dayTasks]) => ({
            date,
            tasks: dayTasks,
            totalPoints: dayTasks
              .filter((t) => t.completed)
              .reduce((sum, t) => sum + t.points, 0),
          }))
          .sort((a, b) => (a.date < b.date ? 1 : -1))

        setDays(dayGroups)
      })
      .catch((err) => setError(err instanceof TaskError ? err.message : 'Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  return { days, loading, error }
}
