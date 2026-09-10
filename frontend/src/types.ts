export type Employee = {
  id: string
  name: string
  email: string
  phone: string | null
  salary: number
}

export type EmployeeInput = {
  name: string
  email: string
  phone: string
  salary: string
}