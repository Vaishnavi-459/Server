import axios from 'axios'

import { Booking_service_Url, deleteBookings, getAllBookedServices,geteBookingBy_ClinicId} from '../../baseUrl'

export const AppointmentData = async () => {
  console.log('appointdata calling')
  try {
    const response = await axios.get(`${Booking_service_Url}/${getAllBookedServices}`)
    console.log(response.data)

    return response.data
  } catch (error) {
    console.error('Error fetching service data:', error.message)
    if (error.response) {
      console.error('Error Response Data:', error.response.data)
      console.error('Error Response Status:', error.response.status)
    }
    throw error
  }
}

export const GetBookingByClinicId = async (id) => {
  console.log('appointdata calling')
  try {
    const response = await axios.get(`${Booking_service_Url}/${geteBookingBy_ClinicId}/${id}`)
    console.log(response.data)

    return response.data
  } catch (error) {
    console.error('Error fetching service data:', error.message)
    if (error.response) {
      console.error('Error Response Data:', error.response.data)
      console.error('Error Response Status:', error.response.status)
    }
    throw error
  }
}

export const deleteBookingData = async (id) => {
  try {
    const response = await axios.delete(`${Booking_service_Url}/${deleteBookings}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Category deleted successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error deleting booking:', error.response?.data || error)
    throw error
  }
}
