// reportsAPI.js
import axios from 'axios'
import { Reports_URL, AllReports } from '../../baseUrl'

export const ReportsData = async () => {
  try {
    const response = await axios.get(`${Reports_URL}/${AllReports}`)
    console.log('API Response:', response.data)

    // If response is already an array of reports
    return response.data
  } catch (error) {
    console.error('Error fetching reports:', error.message)
    return []
  }
}

