import type { Employee, EmployeeInput } from './types'

const endpoint = '/api/Employees'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T
  }

  const responseText = await response.text()
  if (!responseText.trim()) return undefined as T
  return JSON.parse(responseText) as T
}

function toPayload(input: EmployeeInput) {
  const salary = Number(input.salary.replace(/[$,\s]/g, ''))
  if (!Number.isFinite(salary) || salary < 0) {
    throw new Error('Salary must be a non-negative number')
  }

  return {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim() || null,
    salary,
  }
}

export const employeeApi = {
  list: () => request<Employee[]>(endpoint),
  create: (input: EmployeeInput) => request<Employee>(endpoint, {
    method: 'POST',
    body: JSON.stringify(toPayload(input)),
  }),
  update: (id: string, input: EmployeeInput) => request<Employee>(`${endpoint}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toPayload(input)),
  }),
  remove: (id: string) => request<void>(`${endpoint}/${id}`, { method: 'DELETE' }),
}
