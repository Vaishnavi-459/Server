import React, { useState, useEffect, useRef } from 'react'
import {
  CRow,
  CCol,
  CWidgetStatsA,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCarousel,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import Slider from 'react-slick'
import { getStyle } from '@coreui/utils'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilOptions } from '@coreui/icons'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import axios from 'axios'
import { MainAdmin_URL, AllCustomerAdvertisements } from '../../baseUrl'
import { appointments_Ref } from '../../baseUrl'
import { AppointmentData } from '../AppointmentManagement/appointmentAPI'

const WidgetsDropdown = (props) => {
  const [slides, setSlides] = useState([])
  const sliderRef = useRef(null)
  const currentIndex = useRef(0)
  const intervalRef = useRef(null)
  const [bookings, setBookings] = useState([])
  const [activeCard, setActiveCard] = useState('') // state to keep track of which card is clicked eg:"appointments"
  const [len, setLen] = useState(0)
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)
  const widgetChartRef3 = useRef(null)

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get(`${MainAdmin_URL}/${AllCustomerAdvertisements}`)
        if (Array.isArray(response.data)) {
          setSlides(response.data)
          console.log(response.data)
        } else {
          console.error('Invalid response format:', response.data)
        }
      } catch (error) {
        console.error('Error fetching advertisements:', error)
      }
    }

    fetchAdvertisements()
  }, [])
  const fetchAppointments = async (id) => {
    console.log('Hospital ID from localStorage:', id)

    try {
      const data = await AppointmentData() // Fetch all appointments
      console.log('All Appointments:', data)

      //  const filteredData = data.filter((item) => item.id === id);
      //   console.log('Filtered Appointment:', filteredData);
      setBookings(data.data)
      //  setBookings(filteredData); // Set as array if needed
      setLen(data.data.length)
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    }
  }

  useEffect(() => {
    const hospitalId = localStorage.getItem('HospitalId')
    if (hospitalId) {
      fetchAppointments(hospitalId)
    } else {
      console.warn('No HospitalId in localStorage')
    }
  }, [])

  // const dummyImages = [
  //   `${MainAdmin_URL}/${AllCustomerAdvertisements}/600x200?text=Slide+1`,
  //   'https://via.placeholder.com/600x200?text=Slide+2',
  //   'https://via.placeholder.com/600x200?text=Slide+3',
  //   'https://via.placeholder.com/600x200?text=Slide+4',
  // ]

  // Slider settings for react-slick
  useEffect(() => {
    // Clear existing interval
    clearInterval(intervalRef.current)
    if (slides.length === 0 || !sliderRef.current) return

    const handleSlide = () => {
      const currentSlide = slides[currentIndex.current]
      const isVideo = currentSlide.mediaUrlOrImage?.toLowerCase().endsWith('.mp4')

      if (isVideo) {
        const video = document.getElementById(`video-${currentIndex.current}`)
        if (video) {
          video.onended = () => {
            currentIndex.current = (currentIndex.current + 1) % slides.length
            sliderRef.current.slickGoTo(currentIndex.current)
            handleSlide()
          }
        }
      } else {
        intervalRef.current = setTimeout(() => {
          currentIndex.current = (currentIndex.current + 1) % slides.length
          sliderRef.current.slickGoTo(currentIndex.current)
          handleSlide()
        }, 3000)
      }
    }

    handleSlide()

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [slides])

  const getMediaSrc = (src) => {
    if (!src) return ''
    if (src.startsWith('data:') || src.startsWith('http') || src.startsWith('blob:')) return src
    if (src.toLowerCase().endsWith('.mp4')) return src // for external mp4 links
    return `data:image/png;base64,${src}` // adjust type if JPG or SVG
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false, // We will handle it manually
    swipe: false, // Optional: prevent user swipe
  }

  function convertToISODate(dateString) {
    console.log(dateString)

    const date = new Date(dateString)
    if (isNaN(date)) return '' // Handle invalid date
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0')
    console.log(`${year}-${month}-${day}`)

    return `${year}-${month}-${day}`
  }

  return (
    <>
      {/*to display cards*/}
      <CRow className={props.className} xs={{ gutter: 4 }}>
        <CCol sm={6} xl={4}>
          <CWidgetStatsA
            color="primary"
            value={len}
            title="Appointments"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>View</CDropdownItem>
                  <CDropdownItem>Export</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                ref={widgetChartRef1}
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [
                    {
                      label: 'Appointments',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: getStyle('--cui-primary'),
                      data: [30, 50, 40, 60, 55, 65, 70],
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: { x: { display: false }, y: { display: false } },
                  elements: { line: { tension: 0.4 }, point: { radius: 0 } },
                }}
              />
            }
          />
        </CCol>

        <CCol sm={6} xl={4}>
          <CWidgetStatsA
            color="success"
            value={
              <>
                300{' '}
                {/* <span className="fs-6 fw-normal">
                (+2.8%) <CIcon icon={cilArrowTop} />
              </span> */}
              </>
            }
            title="Total Patients"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>View</CDropdownItem>
                  <CDropdownItem>Export</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                ref={widgetChartRef2}
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [
                    {
                      label: 'Patients',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: getStyle('--cui-success'),
                      data: [100, 150, 130, 180, 170, 190, 200],
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: { x: { display: false }, y: { display: false } },
                  elements: { line: { tension: 0.4 }, point: { radius: 0 } },
                }}
              />
            }
          />
        </CCol>

        <CCol sm={6} xl={4}>
          <CWidgetStatsA
            color="warning"
            value={<>85 </>}
            title="Total Doctors"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle color="transparent" caret={false} className="p-0">
                  <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>View</CDropdownItem>
                  <CDropdownItem>Export</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                ref={widgetChartRef3}
                className="mt-3 mx-3"
                style={{ height: '70px' }}
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [
                    {
                      label: 'Doctors',
                      backgroundColor: 'transparent',
                      borderColor: 'rgba(255,255,255,.55)',
                      pointBackgroundColor: getStyle('--cui-warning'),
                      data: [10, 12, 13, 15, 14, 16, 17],
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                  scales: { x: { display: false }, y: { display: false } },
                  elements: { line: { tension: 0.4 }, point: { radius: 0 } },
                }}
              />
            }
          />
        </CCol>
      </CRow>

      {/* Carousel Section */}
      <div style={{ marginTop: '2rem' }}>
        {slides.length > 0 ? (
          <Slider ref={sliderRef} {...sliderSettings}>
            {slides.map((item, idx) => {
              const mediaSrc = getMediaSrc(item.mediaUrlOrImage)
              const isVideo = mediaSrc.toLowerCase().endsWith('.mp4')
              return (
                <div key={item.carouselId || idx}>
                  {isVideo ? (
                    <video
                      id={`video-${idx}`}
                      src={mediaSrc}
                      controls
                      autoPlay
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                        borderRadius: '8px',
                      }}
                    />
                  ) : (
                    <img
                      src={mediaSrc}
                      alt={`Slide ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '500px',
                        objectFit: 'fit',
                        borderRadius: '8px',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </Slider>
        ) : (
          <p>No media found</p>
        )}
      </div>

      {/*to display appointmnt */}
      <div className="container mt-4">
        <h5>Appointments</h5>
        <CTable striped hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Service</CTableHeaderCell>
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Time</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {Array.isArray(bookings) ? (
              bookings
                .filter((item) => {
                  const today = new Date().toISOString().split('T')[0]
                  const itemDate = convertToISODate(item.serviceDate)

                  return itemDate === today && item.bookedStatus?.toLowerCase() === 'pending'
                })

                .map((item) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{item.id}</CTableDataCell>
                    <CTableDataCell>{item.name}</CTableDataCell>
                    <CTableDataCell>{item.servicename}</CTableDataCell>
                    <CTableDataCell>{convertToISODate(item.serviceDate)}</CTableDataCell>
                    <CTableDataCell>{item.slot || item.servicetime}</CTableDataCell>
                    <CTableDataCell>{item.bookedStatus}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" size="sm">
                        View
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan={8}>No bookings data available.</CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>
    </>
  )
}

export default WidgetsDropdown
