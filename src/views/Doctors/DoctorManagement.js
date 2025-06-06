import React, { useEffect, useState, useMemo } from 'react'
import DoctorCard from './Doctorcard'
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'
import axios from 'axios'
import { useHospital } from '../Usecontext/HospitalContext'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CRow,
  CCol,
  CFormLabel,
} from '@coreui/react'
import Select from 'react-select'
import {
  BASE_URL,
  subService_URL,
  getSubServicesbyserviceId,
  MainAdmin_URL,
  getadminSubServicesbyserviceId,
} from '../../baseUrl'
import { serviceData, CategoryData } from '../../views/serviceManagement/ServiceManagementAPI'

const DoctorManagement = () => {
  const { selectedHospital, loading, errorMessage, setSelectedHospital, fetchHospitalDetails } =
    useHospital()

  // const [doctors, setDoctors] = useState([]);

  const [modalVisible, setModalVisible] = useState(false)
  const [newService, setNewService] = useState({
    serviceName: '',
    serviceId: '',
  })
  const [selectedServices, setSelectedServices] = useState([])

  const [form, setForm] = useState({
    doctorPicture: null, // file input or image URL
    doctorLicence: '',
    doctorMobileNumber: '',
    doctorName: '',
    service: [],
    subServices: [], // Note: 'subSerives' in Java, but 'subServices' is more consistent in JS
    specialization: '',
    gender: 'Female',
    experience: '',
    qualification: '',
    availableDays: '', // array of selected days
    availableTimes: '', // array of selected time slots
    profileDescription: '',
    doctorFees: {
      inClinicFee: '',
      vedioConsultationFee: '',
    },
    focusAreas: [], // array of objects like [{label: '', value: ''}]
    languages: [],
    highlights: [],
  })

  console.log(selectedHospital)

  const [startDay, setStartDay] = useState('')
  const [endDay, setEndDay] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [category, setCategory] = useState([])
  const [service, setService] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [filteredServices, setFilteredServices] = useState([])
  const [serviceOptions, setServiceOptions] = useState([])
  const [subServiceOptions, setSubServiceOptions] = useState([])
  const [selectedSubServices, setSelectedSubServices] = useState([])
  const [selectedSubService, setSelectedSubService] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [formErrors, setFormErrors] = useState({})

  const availableDays = (value, type) => {
    if (type === 'start') {
      setStartDay(value)
      const updated = `${value} - ${endDay || ''}`.trim()
      setForm((prev) => ({ ...prev, availableDays: updated }))
    } else if (type === 'end') {
      setEndDay(value)
      const updated = `${startDay || ''} - ${value}`.trim()
      setForm((prev) => ({ ...prev, availableDays: updated }))
    }
  }

  const serviceOptionsFormatted = serviceOptions.map((s) => ({
    value: s.serviceId,
    label: s.serviceName,
  }))

  const handleTimeChange = (value, type) => {
    if (type === 'start') {
      setStartTime(value)
      const updated = `${value} - ${endTime || ''}`.trim()
      setForm((prev) => ({ ...prev, availableTimes: updated }))
    } else if (type === 'end') {
      setEndTime(value)
      const updated = `${startTime || ''} - ${value}`.trim()
      setForm((prev) => ({ ...prev, availableTimes: updated }))
    }
  }

  const fetchSubServices = async (serviceIds) => {
    try {
      const allSubservices = await Promise.all(
        serviceIds.map(async (id) => {
          const res = await axios.get(`${MainAdmin_URL}/${getadminSubServicesbyserviceId}/${id}`)
          return res.data?.data || []
        }),
      )

      const mergedSubServices = allSubservices.flat() // Flatten the 2D array into 1D
      setSubServiceOptions(mergedSubServices)
      console.log('Merged Sub Services:', mergedSubServices)
    } catch (err) {
      console.error('Failed to fetch subservices:', err)
      setSubServiceOptions([])
    }
  }

  const handleChanges = async (e) => {
    const { name, value } = e.target

    if (name === 'categoryId') {
      // Multi-category support
      setNewService((prev) => ({
        ...prev,
        categoryId: value, // Array of selected categoryIds
        serviceId: [],
        serviceName: [],
      }))

      try {
        const allServices = await Promise.all(
          value.map(async (catId) => {
            const res = await axios.get(`${subService_URL}/services/getServices/${catId}`)
            return res.data?.data || []
          }),
        )

        const merged = allServices.flat()
        setServiceOptions(merged)
        console.log(merged)
      } catch (err) {
        console.error('❌ Failed to fetch services:', err)
        setServiceOptions([])
      }
    }

    if (name === 'serviceId') {
      console.log(name)
      console.log(value)
      const selectedServiceObjects = serviceOptions.filter((s) => value.includes(s.serviceId))

      setSelectedServices(selectedServiceObjects) // store [{serviceId, serviceName}]
      // array of selected serviceIds
      console.log(selectedServiceObjects)
      const allSubservices = await Promise.all(
        value.map(async (serviceId) => {
          const res = await axios.get(`${subService_URL}/${getSubServicesbyserviceId}/${serviceId}`)

          return res.data?.data || []
        }),
      )

      const mergedSubServices = allSubservices.flat()
      setSubServiceOptions(mergedSubServices)
      console.log(mergedSubServices)
      setSelectedSubServices(mergedSubServices) // if you want to prefill
    }
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const times = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ]

  const fetchData = async () => {
    try {
      const categoryResponse = await CategoryData()
      if (categoryResponse.data && Array.isArray(categoryResponse.data)) {
        setCategory(categoryResponse.data)
      } else {
        throw new Error('Invalid category data format')
      }

      const serviceResponse = await serviceData()
      console.log(serviceResponse.data)
      setService(serviceResponse.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to fetch data. Please try again later.')
    } finally {
    }
  }
  const hospitalId = localStorage.getItem('HospitalId')
  useEffect(() => {
    const fetchAllData = async () => {
      await fetchData()
      await serviceData()
      await fetchHospitalDetails(hospitalId)
    }

    fetchAllData()
  }, [])

  const validateDoctorForm = () => {
    const errors = {}
    let isValid = true

    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Required Fields
    if (!newService.categoryId || newService.categoryId.length === 0)
      errors.categoryId = 'Please select at least one category.'

    if (!selectedServices || selectedServices.length === 0)
      errors.serviceId = 'Please select at least one service.'

    if (!selectedSubService || selectedSubService.length === 0)
      errors.subServiceName = 'Please select at least one sub service.'

    if (!form.doctorName.trim()) {
      errors.doctorName = 'Doctor name is required'
      isValid = false
    }
    if (!form.doctorLicence.trim()) {
      errors.doctorLicence = 'License number is required'
      isValid = false
    }
    if (!form.doctorMobileNumber || !/^\d{10}$/.test(form.doctorMobileNumber)) {
      errors.doctorMobileNumber = 'Enter a valid 10-digit mobile number'
      isValid = false
    }
    if (!form.experience || isNaN(form.experience) || form.experience < 0) {
      errors.experience = 'Enter valid experience'
      isValid = false
    }
    if (!form.qualification.trim()) {
      errors.qualification = 'Qualification is required'
      isValid = false
    }
    if (!form.specialization.trim()) {
      errors.specialization = 'Specialization is required'
      isValid = false
    }
    if (!form.profileDescription.trim()) {
      errors.profileDescription = 'Profile description is required'
      isValid = false
    }
    if (!form.doctorFees.inClinicFee || isNaN(form.doctorFees.inClinicFee)) {
      errors.inClinicFee = 'Enter valid in-clinic fee'
      isValid = false
    }
    if (!form.doctorFees.vedioConsultationFee || isNaN(form.doctorFees.vedioConsultationFee)) {
      errors.vedioConsultationFee = 'Enter valid video consultation fee'
      isValid = false
    }
    if (!form.doctorPicture) {
      errors.doctorPicture = 'Profile picture is required'
      isValid = false
    }
    if (!form.languages || form.languages.length === 0) {
      errors.languages = 'Please add at least one language.'
    }

    // Day Validation
    if (!startDay || !endDay) {
      errors.availableDays = 'Start and end days are required'
      isValid = false
    } else if (dayOrder.indexOf(startDay) > dayOrder.indexOf(endDay)) {
      errors.availableDays = 'Start day cannot be after end day'
      isValid = false
    }

    // Time Validation
    const convertTo24Hrs = (time) => {
      const [rawTime, modifier] = time.split(' ')
      let [hours, minutes] = rawTime.split(':').map(Number)
      if (modifier === 'PM' && hours !== 12) hours += 12
      if (modifier === 'AM' && hours === 12) hours = 0
      return hours * 60 + minutes
    }

    if (!startTime || !endTime) {
      errors.availableTimes = 'Start and end times are required'
      isValid = false
    } else if (convertTo24Hrs(startTime) >= convertTo24Hrs(endTime)) {
      errors.availableTimes = 'Start time must be before end time'
      isValid = false
    }

    // Set errors to state for UI display
    setFormErrors(errors)
    return Object.keys(errors).length === 0
    return isValid
  }

  const categoryOptions = category.map((cat) => ({
    value: cat.categoryId,
    label: cat.categoryName,
  }))

  //select

  const handleSubmit = async () => {
    if (!form.doctorPicture) {
      errors.doctorPicture = 'Profile picture is required'
      isValid = false
    }

    const errors = validateDoctorForm()
    if (Object.keys(errors).length > 0) {
      toast.error('Please fill all required fields correctly', { position: 'top-right' })
      console.log('Validation Errors:', errors)
      return
    }
    try {
      const hospitalId = localStorage.getItem('HospitalId')

      // const selectedSubServiceObjects = subServiceOptions
      //   .flatMap((s) => s.subServices || [])
      //   .filter((sub) => selectedSubService.includes(sub.subServiceId))
      const allValidSubServiceIds = subServiceOptions.flatMap(
        (s) => s.subServices?.map((ss) => ss.subServiceId) || [],
      )
      const selectedSubServiceObjects = subServiceOptions
        .flatMap((s) => s.subServices || [])
        .filter(
          (sub) =>
            selectedSubService.includes(sub.subServiceId) &&
            allValidSubServiceIds.includes(sub.subServiceId),
        )

      // const selectedCategoryObjects = categoryOptions?.filter((sub) =>
      //   selectedSubService.includes(sub.subServiceId),
      // )

      const payload = {
        hospitalId,
        doctorPicture: form.doctorPicture,
        doctorName: form.doctorName,
        doctorMobileNumber: form.doctorMobileNumber,
        doctorLicence: form.doctorLicence,
        category: categoryOptions
          .filter((cat) => newService.categoryId.includes(cat.value))
          .map((cat) => ({
            categoryId: cat.value,
            categoryName: cat.label,
          })),

        service: selectedServices.map((s) => ({
          serviceId: s.serviceId,
          serviceName: s.serviceName,
        })),

        subServices: selectedSubServiceObjects,
        gender: form.gender,
        experience: form.experience,
        qualification: form.qualification,
        specialization: form.specialization,
        availableDays: form.availableDays,
        availableTimes: form.availableTimes,
        profileDescription: form.profileDescription,
        focusAreas: form.focusAreas,
        languages: form.languages,
        highlights: form.highlights,
        doctorFees: {
          inClinicFee: form.doctorFees.inClinicFee,
          vedioConsultationFee: form.doctorFees.vedioConsultationFee,
        },
      }

      console.log(payload)

      const response = await axios.post(`${BASE_URL}/addDoctor`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // ✅ Success Toast
      toast.success(response?.data?.message || 'Doctor added successfully')

      const newDoctor = response?.data?.doctor ?? payload

      await fetchHospitalDetails(hospitalId)
      setSelectedHospital((prev) => ({
        ...prev,
        doctors: [...(prev?.doctors ?? []), newDoctor],
      }))
      // After successful submission
      setForm({
        doctorPicture: null,
        doctorLicence: '',
        doctorMobileNumber: '',
        doctorName: '',
        gender: 'Female',
        experience: '',
        qualification: '',
        specialization: '',
        availableDays: '',
        availableTimes: '',
        profileDescription: '',
        focusAreas: [],
        languages: [],
        highlights: [],
        doctorFees: {
          inClinicFee: '',
          vedioConsultationFee: '',
        },
      })

      setNewService({
        serviceId: '',
        serviceName: '',
        categoryId: '',
        categoryName: '',
      })

      setSelectedSubServices([])
      setServiceOptions([])
      setSubServiceOptions([])
      setStartDay('')
      setEndDay('')
      setStartTime('')
      setEndTime('')

      setModalVisible(false)
      // 🧹 Clear input fields
    } catch (error) {
      // ❌ Error Toast
      toast.error(error?.response?.data?.message || 'Failed to add doctor. Please try again.')

      console.error('Error submitting doctor data:', error)
    }
  }

  const ChipSection = ({ label, items, onAdd }) => {
    const [input, setInput] = useState('')

    const handleAdd = () => {
      const trimmed = input.trim()
      if (trimmed && !items.includes(trimmed)) {
        onAdd([...items, trimmed])
        setInput('')
      }
    }

    const handleRemove = (indexToRemove) => {
      const updated = items.filter((_, index) => index !== indexToRemove)
      onAdd(updated)
    }
    return (
      <div className="mb-3">
        <label className="form-label fw-semibold">{label}</label>
        <div className="d-flex mb-2">
          <input
            type="text"
            className="form-control me-2"
            placeholder={`Add ${label}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn btn-primary" onClick={handleAdd}>
            Add
          </button>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="badge d-flex align-items-center"
              style={{ padding: '8px 12px', borderRadius: '20px' }}
            >
              <span className="me-2">{item}</span>
              <span
                style={{ cursor: 'pointer', fontSize: '10px' }}
                onClick={() => handleRemove(index)}
              >
                ❌
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  // console.log(selectedHospital)

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm rounded-pill px-4 py-2"
          onClick={() => {
            setFormErrors({})
            setModalVisible(true)
          }}
          style={{
            background: 'linear-gradient(90deg, #0072CE 0%, #00AEEF 100%)',
            border: 'none',
            fontWeight: '600',
            fontSize: '16px',
          }}
        >
          <CIcon icon={cilUser} size="lg" />
          <span>Add Doctor</span>
        </button>
      </div>

      {loading ? (
        <div className="centered-message">
          <p>Loading doctors...</p>
        </div>
      ) : !selectedHospital ? (
        <div className="centered-message">
          <p>{errorMessage || 'PAGE NOT FOUND'}</p>
        </div>
      ) : selectedHospital.doctors?.length === 0 ? (
        <div className="centered-message">
          <p>No doctors found for this hospital.</p>
        </div>
      ) : (
        selectedHospital.data.map((doctor, index) => <DoctorCard key={index} doctor={doctor} />)
      )}

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <strong>Add Doctor</strong>
        </CModalHeader>
        <CModalBody>
          <CRow className="g-4 mb-4">
            <CCol md={6}>
              <h6>
                Category Name <span className="text-danger">*</span>
              </h6>
              <Select
                isMulti
                name="categoryId"
                value={categoryOptions.filter((opt) => newService.categoryId?.includes(opt.value))}
                onChange={(selected) =>
                  handleChanges({
                    target: {
                      name: 'categoryId',
                      value: selected.map((opt) => opt.value),
                    },
                  })
                }
                options={categoryOptions}
                placeholder="Select Category"
              />
              {formErrors.categoryId && (
                <div className="text-danger mt-1">{formErrors.categoryId}</div>
              )}
            </CCol>

            <CCol md={6}>
              <h6>
                Service Name <span className="text-danger">*</span>
              </h6>
              <Select
                isMulti
                name="serviceId"
                value={serviceOptionsFormatted.filter((opt) =>
                  selectedServices.some((s) => s.serviceId === opt.value),
                )}
                onChange={(selected) => {
                  const selectedServiceObjects = serviceOptions.filter((s) =>
                    selected.some((sel) => sel.value === s.serviceId),
                  )
                  setSelectedServices(selectedServiceObjects)
                  fetchSubServices(selectedServiceObjects.map((s) => s.serviceId))

                  // Clear error
                  if (selectedServiceObjects.length > 0) {
                    setFormErrors((prev) => ({ ...prev, serviceId: '' }))
                  }
                }}
                options={serviceOptionsFormatted}
                placeholder="Select Services"
              />
              {formErrors.serviceId && (
                <div className="text-danger mt-1">{formErrors.serviceId}</div>
              )}
            </CCol>

            <CCol md={12}>
              <h6>Sub Services</h6>

              <Select
                isMulti
                name="subServiceName"
                value={subServiceOptions
                  .flatMap((s) => s.subServices || [])
                  .filter((opt) => selectedSubService.includes(opt.subServiceId))
                  .map((opt) => ({
                    label: opt.subServiceName,
                    value: opt.subServiceId,
                  }))}
                onChange={(selected) => {
                  setSelectedSubService(selected.map((opt) => opt.value))
                  if (selected.length > 0) {
                    setFormErrors((prev) => ({ ...prev, subServiceName: '' }))
                  }
                }}
                options={subServiceOptions
                  .flatMap((s) => s.subServices || [])
                  .map((sub) => ({
                    label: sub.subServiceName,
                    value: sub.subServiceId,
                  }))}
                placeholder="Select Sub Service"
              />

              {formErrors.subServiceName && (
                <div className="text-danger mt-1">{formErrors.subServiceName}</div>
              )}
            </CCol>
          </CRow>

          <hr />

          <h5 className="mb-3">Doctor Details</h5>
          <CRow className="g-4 mb-4">
            <CCol md={6}>
              <CFormLabel>License Number</CFormLabel>
              <CFormInput
                value={form.doctorLicence}
                onChange={(e) => {
                  const value = e.target.value
                  setForm((prev) => ({ ...prev, doctorLicence: value }))

                  // ❗ clear error if corrected
                  if (formErrors?.doctorLicence && value.trim()) {
                    setFormErrors((prev) => {
                      const updated = { ...prev }
                      delete updated.doctorLicence
                      return updated
                    })
                  }
                }}
                invalid={!!formErrors?.doctorLicence} // CoreUI validation styling
              />
              {formErrors?.doctorLicence && (
                <small className="text-danger">{formErrors.doctorLicence}</small>
              )}
            </CCol>

            <CCol md={6}>
              <CFormLabel>Doctor Name</CFormLabel>
              <div className="input-group">
                <CFormInput
                  value={form.doctorName}
                  onChange={(e) => {
                    const name = e.target.value
                    const withPrefix = name.startsWith('Dr.') ? name : `Dr. ${name}`
                    setForm((prev) => ({ ...prev, doctorName: withPrefix }))

                    // Clear error when valid input provided
                    if (withPrefix.length > 3) {
                      setFormErrors((prev) => ({ ...prev, doctorName: '' }))
                    }
                  }}
                  invalid={!!formErrors.doctorName}
                />
              </div>
              {formErrors.doctorName && (
                <div className="text-danger mt-1">{formErrors.doctorName}</div>
              )}
            </CCol>

            <CCol md={6}>
              <CFormLabel>Gender</CFormLabel>
              <CFormSelect
                value={form.gender}
                onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormLabel>Experience (years)</CFormLabel>
              <CFormInput
                type="number"
                value={form.experience}
                onChange={(e) => {
                  const value = e.target.value
                  setForm((p) => ({ ...p, experience: value }))

                  // Clear error if value is a valid number >= 0
                  if (!isNaN(value) && Number(value) >= 0) {
                    setFormErrors((prev) => ({ ...prev, experience: '' }))
                  }
                }}
                invalid={!!formErrors.experience}
              />
              {formErrors.experience && (
                <div className="text-danger mt-1">{formErrors.experience}</div>
              )}
            </CCol>

            <CCol md={6}>
              <CFormLabel>Qualification</CFormLabel>
              <CFormInput
                value={form.qualification}
                onChange={(e) => {
                  const value = e.target.value
                  setForm((p) => ({ ...p, qualification: value }))
                  setFormErrors((prev) => ({
                    ...prev,
                    qualification: value.trim() ? '' : 'Qualification is required',
                  }))
                }}
                invalid={!!formErrors.qualification}
              />
              {formErrors.qualification && (
                <div className="text-danger mt-1">{formErrors.qualification}</div>
              )}
            </CCol>

            <CCol md={6}>
              <CFormLabel>Specialization</CFormLabel>
              <CFormInput
                value={form.specialization}
                onChange={(e) => {
                  const value = e.target.value
                  setForm((p) => ({ ...p, specialization: value }))
                  setFormErrors((prev) => ({
                    ...prev,
                    specialization: value.trim() ? '' : 'Specialization is required',
                  }))
                }}
                invalid={!!formErrors.specialization}
              />
              {formErrors.specialization && (
                <div className="text-danger mt-1">{formErrors.specialization}</div>
              )}
            </CCol>

            <CCol md={6}>
              <CFormLabel>Profile Description</CFormLabel>
              <CFormTextarea
                value={form.profileDescription}
                onChange={(e) => {
                  const value = e.target.value
                  setForm((p) => ({ ...p, profileDescription: value }))
                  setFormErrors((prev) => ({
                    ...prev,
                    profileDescription: value.trim() ? '' : 'Profile description is required',
                  }))
                }}
                invalid={!!formErrors.profileDescription}
                rows={4}
              />
              {formErrors.profileDescription && (
                <div className="text-danger mt-1">{formErrors.profileDescription}</div>
              )}
            </CCol>

            <CCol md={6}>
              <CFormLabel>Profile Picture</CFormLabel>
              <CFormInput
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setForm((p) => ({ ...p, doctorPicture: reader.result }))
                      setFormErrors((prev) => ({
                        ...prev,
                        doctorPicture: '', // clear error
                      }))
                    }
                    reader.readAsDataURL(file)
                  } else {
                    setFormErrors((prev) => ({
                      ...prev,
                      doctorPicture: 'Profile picture is required',
                    }))
                  }
                }}
                invalid={!!formErrors.doctorPicture}
              />
              {formErrors.doctorPicture && (
                <div className="text-danger mt-1">{formErrors.doctorPicture}</div>
              )}
            </CCol>
          </CRow>

          <hr />

          <h5 className="mb-3">Working Schedule</h5>
          <CRow className="g-4 mb-4">
            <CCol md={6}>
              <CFormLabel>Start Day</CFormLabel>
              <CFormSelect
                value={startDay}
                onChange={(e) => {
                  setStartDay(e.target.value)
                  availableDays(e.target.value, 'start')
                  setFormErrors((prev) => ({ ...prev, availableDays: '' })) // ✅ clear error
                }}
              >
                <option value="">Select</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormLabel>End Day</CFormLabel>
              <CFormSelect
                value={endDay}
                onChange={(e) => {
                  setEndDay(e.target.value)
                  availableDays(e.target.value, 'end')
                  setFormErrors((prev) => ({ ...prev, availableDays: '' }))
                }}
              >
                <option value="">Select</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </CFormSelect>
              {formErrors.availableDays && (
                <div className="text-danger">{formErrors.availableDays}</div>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel>Start Time</CFormLabel>
              <CFormSelect
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value)
                  handleTimeChange(e.target.value, 'start')
                  setFormErrors((prev) => ({ ...prev, availableTimes: '' }))
                }}
              >
                <option value="">Select</option>
                {times.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormLabel>End Time</CFormLabel>
              <CFormSelect
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value)
                  handleTimeChange(e.target.value, 'end')
                  setFormErrors((prev) => ({ ...prev, availableTimes: '' }))
                }}
              >
                <option value="">Select</option>
                {times.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            {formErrors.availableTimes && (
              <div className="text-danger">{formErrors.availableTimes}</div>
            )}
          </CRow>

          <hr />

          <h5 className="mb-3">Consultation Fees & Contact</h5>
          <CRow className="g-4 mb-4">
            {/* In-Clinic Fee */}
            <CCol md={4}>
              <CFormLabel>In-Clinic Fee</CFormLabel>
              <CFormInput
                type="number"
                value={form.doctorFees.inClinicFee}
                onChange={(e) => {
                  const value = e.target.value
                  setForm((prev) => ({
                    ...prev,
                    doctorFees: { ...prev.doctorFees, inClinicFee: value },
                  }))
                  if (value && !isNaN(value) && Number(value) > 0) {
                    setFormErrors((prev) => ({ ...prev, inClinicFee: '' }))
                  }
                }}
              />
              {formErrors.inClinicFee && (
                <div className="text-danger">{formErrors.inClinicFee}</div>
              )}
            </CCol>

            {/* Video Consultation Fee */}
            <CCol md={4}>
              <CFormLabel>Video Consultation Fee</CFormLabel>
              <CFormInput
                type="number"
                value={form.doctorFees.vedioConsultationFee}
                onChange={(e) => {
                  const value = e.target.value
                  setForm((prev) => ({
                    ...prev,
                    doctorFees: { ...prev.doctorFees, vedioConsultationFee: value },
                  }))
                  if (value && !isNaN(value) && Number(value) > 0) {
                    setFormErrors((prev) => ({ ...prev, vedioConsultationFee: '' }))
                  }
                }}
              />
              {formErrors.vedioConsultationFee && (
                <div className="text-danger">{formErrors.vedioConsultationFee}</div>
              )}
            </CCol>

            {/* Mobile Number */}
            <CCol md={4}>
              <CFormLabel>Contact Number</CFormLabel>
              <CFormInput
                type="tel"
                maxLength={10}
                value={form.doctorMobileNumber}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^\d{0,10}$/.test(value)) {
                    setForm((prev) => ({ ...prev, doctorMobileNumber: value }))
                    if (/^\d{10}$/.test(value)) {
                      setFormErrors((prev) => ({ ...prev, doctorMobileNumber: '' }))
                    }
                  }
                }}
                placeholder="Enter 10-digit number"
              />
              {formErrors.doctorMobileNumber && (
                <div className="text-danger">{formErrors.doctorMobileNumber}</div>
              )}
            </CCol>
          </CRow>

          <hr />

          <h5 className="mb-3">Additional Details</h5>
          <ChipSection
            label="Area of Expertise"
            items={form.focusAreas}
            onAdd={(items) => setForm((prev) => ({ ...prev, focusAreas: items }))}
          />
          <div className="mb-3">
            <ChipSection
              label="Languages Known"
              items={form.languages}
              onAdd={(items) => {
                setForm((prev) => ({ ...prev, languages: items }))
                if (items.length > 0) {
                  setFormErrors((prev) => ({ ...prev, languages: '' }))
                }
              }}
            />
            {formErrors.languages && <div className="text-danger mt-1">{formErrors.languages}</div>}
          </div>

          <ChipSection
            label="Achievements / Awards"
            items={form.highlights}
            onAdd={(items) => setForm((prev) => ({ ...prev, highlights: items }))}
          />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            Submit
          </CButton>
        </CModalFooter>
      </CModal>

      <style>{`
        .add-doctor-wrapper {
          position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
        }

        .add-doctor-btn {
          display: flex;
          align-items: center;
          background-color: #fff;
          border: 1px solid #00aaff;
          border-radius: 8px;
          padding: 8px 16px;
          color: #00aaff;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .add-doctor-btn:hover {
          background-color: #e0f7ff;
        }

        .add-icon-circle {
          width: 40px;
          height: 40px;
          min-width: 40px;
          min-height: 40px;
          background-color: #e6f7ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          border: 1px solid #00aaff;
        }

        .add-doctor-text {
          color: #00aaff;
        }
          .badge {
  background-color: #e2e3e5;
  color: #000;
}
  .centered-message {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh; // Adjust based on your layout
  text-align: center;
  font-size: 1.2rem;
}


      `}</style>
    </div>
  )
}

export default DoctorManagement
