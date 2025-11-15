/**
 * Format date string to datetime-local input format
 * @param dateString - ISO date string
 * @returns Formatted string for datetime-local input (YYYY-MM-DDTHH:mm)
 */
export function formatDateTimeLocal(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Validate time range
 * @returns Error message if invalid, null if valid
 */
export function validateTimeRange(startTime: string, endTime: string): string | null {
  if (!startTime || !endTime) {
    return "Vui lòng nhập đầy đủ thời gian"
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return "Thời gian kết thúc phải sau thời gian bắt đầu"
  }

  return null
}
