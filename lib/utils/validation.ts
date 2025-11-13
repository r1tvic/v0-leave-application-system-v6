export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long"
  }
  return null
}

export const validateDateRange = (startDate: string, endDate: string): string | null => {
  if (!startDate || !endDate) {
    return "Both dates are required"
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (start > end) {
    return "Start date must be before end date"
  }

  return null
}

export const calculateLeaveDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
}
