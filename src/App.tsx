import { useState } from 'react'
import { AuthGate } from './components/AuthGate'
import { HistoryView } from './components/HistoryView'
import { TasksView } from './components/TasksView'
import { signOut } from './lib/auth'

function App() {
  const [view, setView] = useState<'today' | 'history'>('today')

  return (
    <AuthGate>
      <button type="button" onClick={() => signOut()}>
        Log out
      </button>

      <nav>
        <button type="button" onClick={() => setView('today')} disabled={view === 'today'}>
          Today
        </button>
        <button type="button" onClick={() => setView('history')} disabled={view === 'history'}>
          History
        </button>
      </nav>

      {view === 'today' ? <TasksView /> : <HistoryView />}
    </AuthGate>
  )
}

export default App
