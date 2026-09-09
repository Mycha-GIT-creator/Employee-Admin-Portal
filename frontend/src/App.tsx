import { useEffect, useMemo, useState } from 'react'
import { BriefcaseBusiness, Check, CircleAlert, Mail, Pencil, Phone, Plus, Search, Trash2, Users, X } from 'lucide-react'
import { employeeApi } from './api'
import type { Employee, EmployeeInput } from './types'

const emptyForm: EmployeeInput = { name: '', email: '', phone: '', salary: '' }

function formatSalary(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState<Employee | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const loadEmployees = async () => {
    setIsLoading(true)
    setError('')
    try {
      setEmployees(await employeeApi.list())
    } catch {
      setError('Could not reach the employee service. Check that the API is running on port 5148.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { void loadEmployees() }, [])

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return employees
    return employees.filter((employee) => [employee.name, employee.email, employee.phone].some((value) => value?.toLowerCase().includes(normalizedQuery)))
  }, [employees, query])

  const openAdd = () => { setEditing(null); setIsAdding(true); setError('') }
  const openEdit = (employee: Employee) => { setEditing(employee); setIsAdding(true); setError('') }

  const handleDelete = async (employee: Employee) => {
    if (!window.confirm(`Remove ${employee.name} from the directory?`)) return
    try {
      await employeeApi.remove(employee.id)
      setEmployees((current) => current.filter((item) => item.id !== employee.id))
      setNotice(`${employee.name} was removed`)
    } catch { setError('That employee could not be removed. Please try again.') }
  }

  const handleSaved = (employee: Employee, wasEditing: boolean) => {
    setEmployees((current) => wasEditing ? current.map((item) => item.id === employee.id ? employee : item) : [employee, ...current])
    setIsAdding(false)
    setNotice(wasEditing ? `${employee.name} was updated` : `${employee.name} joined the team`)
  }

  const averageSalary = employees.length ? employees.reduce((sum, employee) => sum + employee.salary, 0) / employees.length : 0

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark"><BriefcaseBusiness size={18} /></span><span>Employee Admin Portal</span></div>
      </header>

      <section className="metrics" aria-label="Team summary">
        <div className="metric"><span className="metric-icon green"><Users size={19} /></span><div><span className="metric-label">Total people</span><strong>{employees.length}</strong></div></div>
        <div className="metric"><span className="metric-icon yellow"><Check size={19} /></span><div><span className="metric-label">Average salary</span><strong>{formatSalary(averageSalary)}</strong></div></div>
        <div className="metric"><span className="metric-icon coral"><BriefcaseBusiness size={19} /></span><div><span className="metric-label">Directory status</span><strong>Up to date</strong></div></div>
      </section>

      <section className="directory-panel">
        <div className="panel-heading"><div><p className="eyebrow">Directory</p><h2>All employees <span>{filteredEmployees.length}</span></h2></div><div className="directory-actions"><label className="search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people" /></label><button className="primary-button" onClick={openAdd}><Plus size={18} /> Add employee</button></div></div>
        {error && <div className="alert error"><CircleAlert size={17} />{error}<button className="retry-button" onClick={() => void loadEmployees()}>Retry</button><button onClick={() => setError('')} aria-label="Dismiss error"><X size={16} /></button></div>}
        {notice && <div className="alert success"><Check size={17} />{notice}<button onClick={() => setNotice('')} aria-label="Dismiss message"><X size={16} /></button></div>}
        {isLoading ? <div className="empty"><div className="spinner" /><p>Loading your directory...</p></div> : filteredEmployees.length === 0 ? <div className="empty"><Users size={32} /><h3>{query ? 'No matches found' : 'Your directory is empty'}</h3><p>{query ? 'Try a different name or email.' : 'Add your first employee to get started.'}</p></div> : <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Contact</th><th>Salary</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{filteredEmployees.map((employee) => <tr key={employee.id}><td><div className="person"><span className="avatar">{initials(employee.name)}</span><div><strong>{employee.name}</strong><small>Employee</small></div></div></td><td><div className="contact"><span><Mail size={14} />{employee.email}</span>{employee.phone && <span><Phone size={14} />{employee.phone}</span>}</div></td><td className="salary">{formatSalary(employee.salary)}</td><td><div className="actions"><button className="icon-button" onClick={() => openEdit(employee)} aria-label={`Edit ${employee.name}`}><Pencil size={16} /></button><button className="icon-button danger" onClick={() => void handleDelete(employee)} aria-label={`Delete ${employee.name}`}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}
      </section>

      <footer><span>Employee Admin Portal</span><span>Built for the people team</span></footer>
      {isAdding && <EmployeeModal employee={editing} onClose={() => setIsAdding(false)} onSaved={handleSaved} />}
    </main>
  )
}

function EmployeeModal({ employee, onClose, onSaved }: { employee: Employee | null; onClose: () => void; onSaved: (employee: Employee, wasEditing: boolean) => void }) {
  const [form, setForm] = useState<EmployeeInput>(employee ? { name: employee.name, email: employee.email, phone: employee.phone ?? '', salary: String(employee.salary) } : emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const update = (field: keyof EmployeeInput, value: string) => setForm((current) => ({ ...current, [field]: value }))
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setIsSaving(true); setError('')
    try { const result = employee ? await employeeApi.update(employee.id, form) : await employeeApi.create(form); onSaved(result, Boolean(employee)) }
    catch { setError('Unable to save changes. Check the form and try again.') }
    finally { setIsSaving(false) }
  }
  return <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><p className="eyebrow">Directory record</p><h2 id="modal-title">{employee ? 'Edit employee' : 'Add employee'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div><form onSubmit={submit}><div className="form-grid"><label>Full name<input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Jordan Lee" /></label><label>Email address<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="jordan@company.com" /></label><label>Phone number<input value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="Optional" /></label><label>Annual salary<input required min="0" step="1000" type="number" value={form.salary} onChange={(event) => update('salary', event.target.value)} placeholder="65000" /></label></div>{error && <p className="form-error"><CircleAlert size={15} />{error}</p>}<div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={isSaving}>{isSaving ? 'Saving...' : employee ? 'Save changes' : 'Add employee'}</button></div></form></div></div>
}

export default App
