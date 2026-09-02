import { useEffect, useState } from 'react'
import { listTasksInRange, periodRange, TaskError, type StatsPeriod } from '../lib/tasks'

export function useTaskStats(period: StatsPeriod) {
  const [completedCount, setCompletedCount] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { fromDate, toDate } = periodRange(period)

    listTasksInRange(fromDate, toDate)
      .then((tasks) => {
        const completed = tasks.filter((t) => t.completed)
        setCompletedCount(completed.length)
        setTotalPoints(completed.reduce((sum, t) => sum + t.points, 0))
        setError(null)
      })
      .catch((err) => setError(err instanceof TaskError ? err.message : 'Failed to load stats'))
      .finally(() => setLoading(false))
  }, [period])

  return { completedCount, totalPoints, loading, error }
}
