import axios from './axios'

interface ReportFilters {
  startDate?: string
  endDate?: string
  type?: string
}

export const getReportData = async (filters: ReportFilters) => {
  const params = new URLSearchParams()
  if (filters.startDate) params.append('startDate', filters.startDate)
  if (filters.endDate) params.append('endDate', filters.endDate)
  if (filters.type) params.append('type', filters.type)

  const response = await axios.get(`/report?${params.toString()}`)
  return response.data
}
