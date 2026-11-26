import { useEffect, useState } from 'react'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

export default function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')

  async function loadTodos() {
    try {
      const res = await fetch(`${API_URL}/api/todos`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setTodos(await res.json())
      setError('')
    } catch (err) {
      setError(`Could not load todos: ${err.message}`)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  async function addTodo(e) {
    e.preventDefault()
    if (!title.trim()) return
    await fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    setTitle('')
    loadTodos()
  }

  async function removeTodo(id) {
    await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE' })
    loadTodos()
  }

  return (
    <main className="container">
      <h1>Todos</h1>
      <form onSubmit={addTodo}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" />
        <button type="submit">Add</button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'done' : ''}>
            <span>{todo.title}</span>
            <button onClick={() => removeTodo(todo.id)} aria-label="Remove">✕</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && !error && <p className="empty">No todos yet.</p>}
    </main>
  )
}
