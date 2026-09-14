import { useEffect, useState } from 'react'
import { employeeApi } from './api'
import type { Employee, EmployeeInput } from './types'
import Login from './Login'
import { auth } from './api'

const emptyForm: EmployeeInput = { name: '', email: '', phone: '', salary: '' }

function App() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [error, setError] = useState('')
    const [form, setForm] = useState<EmployeeInput>(emptyForm)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [searchName, setSearchName] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(!!auth.getToken())



  const loadEmployees = () => {
    employeeApi.list()
      .then(setEmployees)
      .catch(() => setError('Could not load employees'))
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  const handleSearch = () => {
        setError('')
        employeeApi.search({ name: searchName })
            .then(setEmployees)
            .catch(() => setError('Search failed'))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    try {
      if (editingId) {
        await employeeApi.update(editingId, form)
      } else {
        await employeeApi.create(form)
      }
      setForm(emptyForm)
      setEditingId(null)
      loadEmployees()
    } catch {
      setError(editingId ? 'Could not update employee' : 'Could not create employee')
    }
  }

  const handleDelete = async (employee: Employee) => {
    if (!window.confirm(`Delete ${employee.name}?`)) return
    setError('')
    try {
      await employeeApi.remove(employee.id)
      loadEmployees()
    } catch {
      setError('Could not delete employee')
    }
  }

  const startEdit = (employee: Employee) => {
    setEditingId(employee.id)
    setForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone ?? '',
      salary: String(employee.salary),
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

 if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />
  }

  return (
    <div className="shell">
        <h1>Employees </h1>
        <button className="secondary" onClick={() => { auth.clearToken(); setIsLoggedIn(false); }} style={{ marginBottom: '16px' }}>
        Log out
        </button>
            < div style = {{ display: 'flex', gap: '8px', marginBottom: '16px' }
      }>
          <input
                placeholder="Search by name"
      value = { searchName }
      onChange = {(e) => setSearchName(e.target.value)}
        />
    < button onClick = { handleSearch } > Search </button>
        < button className = "secondary" onClick = {() => { setSearchName(''); loadEmployees() }}> Clear </button>
            </div>
      {error && <p className="error">{error}</p>}

      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            <span className="employee-info">
              {employee.name} — {employee.email} — ${employee.salary}
            </span>
            <span className="employee-actions">
              <button className="secondary" onClick={() => startEdit(employee)}>Edit</button>
              <button className="secondary" onClick={() => handleDelete(employee)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>

      <h2>{editingId ? 'Edit employee' : 'Add employee'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Salary"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
        />
        <span className="employee-actions">
          <button type="submit">{editingId ? 'Save changes' : 'Add'}</button>
          {editingId && <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>}
        </span>
      </form>
    </div>
  )
}

export default App