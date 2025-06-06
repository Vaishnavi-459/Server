import axios from 'axios'

import {
  BASE_URL,
  service,
  Category,
  AddSubService,
  updateService,
  deleteService,
  MainAdmin_URL,
  subService_URL,
  subservice,
} from '../../baseUrl'

export const serviceData = async () => {
  try {
    const response = await axios.get(`${subService_URL}/${subservice}`)

    console.log('Service response:', response.data)
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('Service response:', error.response.data) // Log structured response instead of treating it as an error
      return error.response.data // Return response instead of throwing an error
    } else {
      console.error('Unexpected error:', error.message || error)
      throw error
    }
  }
}

export const CategoryData = async () => {
  try {
    const response = await axios.get(`${MainAdmin_URL}/${Category}`)

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

export const postServiceData = async (serviceData, id) => {
  console.log('Sending data to id:', id)

  try {
    console.log('Sending data to API:', serviceData)

    const response = await axios.post(`${BASE_URL}/${AddSubService}/${id}`, serviceData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  } catch (error) {
    console.error('Error response:', error.response)
    alert(
      `Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`,
    )
  }
}

export const updateServiceData = async (serviceId, serviceData) => {
  console.log(serviceId, serviceData)
  try {
    const response = await axios.put(`${BASE_URL}/${updateService}/${serviceId}`, serviceData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log('Service updated successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error updating service:', error)
    throw error
  }
}

export const deleteServiceData = async (serviceId, id) => {
  try {
    console.log('Service name:', serviceId)
    const response = await axios.delete(`${BASE_URL}/${deleteService}/${id}/${serviceId}`)

    console.log('Service deleted successfully:', response.data)
    return response.data
  } catch (error) {
    throw error
  }
}
