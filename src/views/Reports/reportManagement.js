import React, { useEffect, useState } from 'react'
import {
  CButton,
  CModal,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CModalBody,
} from '@coreui/react'
import { ReportsData } from '../Reports/reportAPI'

import { AppointmentData } from '../AppointmentManagement/appointmentAPI'
const ReportsManagement = () => {
  // const [viewService, setViewService] = useState(null)
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [viewService, setViewService] = useState([])

  const fetchAppointments = async (id) => {
    console.log('Hospital ID from localStorage:', id)

    try {
      const data = await AppointmentData()
      console.log('All Appointments:', data)
      setLoading(false)
      setBookings(data.data) // Set as array if needed
      console.log(data.data)
    } catch (error) {
      setLoading(false)
      console.error('Failed to fetch appointments:', error)
    }
  }
  const selectedStatus = 'pending' // or 'confirmed', etc.
  // 🔁 Filter when bookings or status changes
  useEffect(() => {
    const filtered = bookings.filter(
      (booking) => booking.status?.toLowerCase().trim() === selectedStatus.toLowerCase().trim(),
    )
    setFilteredData(filtered)
  }, [bookings, selectedStatus]) // dependencies: run whenever these change

  useEffect(() => {
    const hospitalId = localStorage.getItem('HospitalId')
    if (hospitalId) {
      fetchAppointments(hospitalId)
    } else {
      console.warn('No HospitalId in localStorage')
    }
  }, [])

  const normalize = (value) => value?.toLowerCase().trim()

  return (
    <div style={{ overflowX: 'auto' }}>
      <div className="container mt-4">
        <h5 className="mb-3">Appointments</h5>

        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>S.No</CTableHeaderCell>
              <CTableHeaderCell>H_ID</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Service</CTableHeaderCell>
              <CTableHeaderCell>Consultation Type</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Time</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                // <CTableRow key={item.id || `${item.name}-${index}`}>
                <CTableRow key={`${item.id} -${index}`}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.id}</CTableDataCell>
                  <CTableDataCell>{item.name}</CTableDataCell>
                  <CTableDataCell>{item.servicename}</CTableDataCell>
                  <CTableDataCell>{item.consultationType}</CTableDataCell>
                  <CTableDataCell>
                    {item.sele ? `${item.sele} ` : ''}
                    {item.serviceDate}
                  </CTableDataCell>
                  <CTableDataCell>{item.slot || item.servicetime}</CTableDataCell>
                  <CTableDataCell>{item.bookedStatus}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" onClick={() => setViewService(item)}>
                      View
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center text-danger fw-bold">
                  No appointments found.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
      {viewService && (         
          <div style={{ padding: '20px' }}>
             <h5>Report Details</h5>      
            <CTable bordered responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Name </CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Type</CTableHeaderCell>
                  <CTableHeaderCell>File</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                 <CTableRow>
                  <CTableDataCell>{viewService.reportId}</CTableDataCell>
                 </CTableRow>
              </CTableBody>
            </CTable>
          </div>
     
      )}
    </div>
  )
}

export default ReportsManagement
