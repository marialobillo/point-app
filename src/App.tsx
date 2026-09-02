import { useState } from 'react'
import { AuthGate } from './components/AuthGate'
import { HistoryView } from './components/HistoryView'
import { StatsView } from './components/StatsView'
import { TasksView } from './components/TasksView'
import { signOut } from './lib/auth'

function App() {
  const [view, setView] = useState<'today' | 'history' | 'stats'>('today')

  return (
    <AuthGate>
      <div className="min-h-screen bg-bg">
        <header className="mx-auto flex w-full max-w-lg items-center justify-between px-6 pt-8">
          <nav className="flex gap-1 rounded-md bg-surface p-1">
            <button
              type="button"
              onClick={() => setView('today')}
              disabled={view === 'today'}
              className={
                view === 'today'
                  ? 'rounded px-3 py-1.5 text-sm font-semibold text-bg bg-mint'
                  : 'rounded px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-ink'
              }
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setView('history')}
              disabled={view === 'history'}
              className={
                view === 'history'
                  ? 'rounded px-3 py-1.5 text-sm font-semibold text-bg bg-mint'
                  : 'rounded px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-ink'
              }
            >
              History
            </button>
            <button
              type="button"
              onClick={() => setView('stats')}
              disabled={view === 'stats'}
              className={
                view === 'stats'
                  ? 'rounded px-3 py-1.5 text-sm font-semibold text-bg bg-mint'
                  : 'rounded px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-ink'
              }
            >
              Stats
            </button>
          </nav>

          <button
            type="button"
            onClick={() => signOut()}
            className="text-sm font-medium text-ink-muted hover:text-amber"
          >
            Log out
          </button>
        </header>

        {view === 'today' && <TasksView />}
        {view === 'history' && <HistoryView />}
        {view === 'stats' && <StatsView />}
      </div>
    </AuthGate>
  )
}

export default App
