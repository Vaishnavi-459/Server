// doctorUtils.js

import axios from 'axios'
import { BASE_URL } from '../../baseUrl'

export const handleDeleteToggle = async (doctorID) => {
  console.log(doctorID)
  try {
    const response = await axios.delete(`${BASE_URL}/deleteDoctor/${doctorID}`)
    console.log('Doctor deleted successfully:', response.data)
    // Optional: return true or response if needed
    return response
  } catch (error) {
    console.error('Error occurred while deleting doctor:', error.response?.data || error.message)
    // Optional: return false or error if needed
    return false
  }
}
