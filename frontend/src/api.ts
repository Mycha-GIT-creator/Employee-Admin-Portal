import type { Employee, EmployeeInput } from './types'
const TOKEN_KEY = 'authToken'

const endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/Employees`
export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = auth.getToken()
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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
export const authApi = {
  login: (username: string, password: string) =>
    request<{ token: string }>(`${import.meta.env.VITE_API_BASE_URL}/api/Auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
}

export const employeeApi = {
    list: () => request<Employee[]>(endpoint),
    search: (filters: { name?: string; minSalary?: string; maxSalary?: string }) => {
        const params = new URLSearchParams()
        if (filters.name) params.set('name', filters.name)
        if (filters.minSalary) params.set('minSalary', filters.minSalary)
        if (filters.maxSalary) params.set('maxSalary', filters.maxSalary)
        return request<Employee[]>(`${endpoint}/search?${params.toString()}`)
    },
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