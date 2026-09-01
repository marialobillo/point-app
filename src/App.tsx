import { AuthGate } from './components/AuthGate'
import { TasksView } from './components/TasksView'
import { signOut } from './lib/auth'

function App() {
  return (
    <AuthGate>
      <button type="button" onClick={() => signOut()}>
        Log out
      </button>

      <TasksView />
    </AuthGate>
  )
}

export default App
