// export const BASE_URL = 'http://alb-dev-sc-197990416.ap-south-1.elb.amazonaws.com/api'

export let wifiUrl = '13.233.4.227'

export const BASE_URL = `http://${wifiUrl}:9090/clinic-admin`
export const MainAdmin_URL = `http://${wifiUrl}:9090/admin`
export const Doctor_URL = `http://${wifiUrl}:9090/api/doctors`
export const Reports_URL = `http://${wifiUrl}:9090/api/reports`
export const subService_URL = `http://${wifiUrl}:9090/api/v1`
// END POINTS

// login
export const endPoint = 'admin/login'
//Doctors

//reports
export const AllReports = `getallreports`

//appointments
// export const allBooking_sevices = `getAllBookedServices`
export const getAllBookedServices = `customer/getAllBookedServices`
export const Booking_service_Url = `http://${wifiUrl}:8083/api`
export const deleteBookings = `customer/deleteService`
export const geteBookingBy_ClinicId = `customer/getAllBookedServicesByClinicId`

//Advertisement
export const addCustomerAdvertisement = 'categoryAdvertisement/add'
export const AllCustomerAdvertisements = 'categoryAdvertisement/getAll'

//dmy-appounmtnts
export const baseURL = 'http://localhost:3000'
export const appointments_Ref = `${baseURL}/bookings` // for your appointments

// Customer Management
export const CustomerAllData = 'admin/getAllCustomerDetails'

export const CustomerDataByID = 'admin/getBasicCustomerDetails'

export const updateCustomer = 'admin/updateCustomerBasicDetails'

export const CustomerAddress = 'admin/getCustomerAddresses'

export const AddAddress = 'customers/save-address'

export const UpdateAddress = 'admin/updateAddresses'

export const DeleteAddress = 'admin/deleteAddresses'

export const bookServices = 'customers/bookServices'

export const deleteAppointments = 'customers/deleteService'

// Provider Management

export const ProviderAllData = 'admin/getAllProviderDetails'

export const BasicDetails = 'admin/getCaregiverDetails'

export const updateBasic = 'admin/updateCaregiver'

export const BasicProfile = 'admin/getProviderBasicProfile'

export const UpdateBasicProfile = 'admin/updateBasicProfile'

export const qualification = 'admin/getQualificationDetails'

export const updateQualification = 'admin/updateQualification'

export const Experience = 'admin/getExperienceDetails'

export const updateExperience = 'admin/updateExperienceDetails'

export const AddExperience = 'providers/addExperienceDetails'

export const DeleteExperience = 'admin/deleteExperience'

export const courseCertification = 'admin/getCourseCertificationDetails'

export const updateCourse = 'admin/updateCourseCertification'

export const deleteCourse = 'admin/deleteCourseCertification'

export const Bank = 'admin/getBankAccountDetails'

export const updateBank = 'admin/updateBankAccount'

export const Verification = 'admin/getVerficationDetails'

export const updateVerification = 'admin/verfiyProvider'

export const getAppointments = 'admin/appointments'

// Service management

export const service = 'subService/getAllSubServies'
export const getservice = 'services/getServices'

export const Category = 'getCategories'

export const AddSubService = 'addSubService'

export const updateService = 'services/updateService'

export const deleteService = 'deleteSubService'

// SUb Service

export const subservice = 'subServices/getAllSubServices'
export const getSubServicesbyserviceId = 'subServices/getSubServicesbyserviceId'
export const getadminSubServicesbyserviceId = `getSubServicesByServiceId`

// Category Management

export const CategoryAllData = 'category/getCategories'

export const AddCategory = 'category/addCategory'

export const UpdateCategory = 'category/updateCategory'

export const deleteCategory = 'category/deleteCategory'

// Appointment Management
export const getAllBookingDetails = 'admin/getAllBookingDetails'

// Reassign Appointment

export const getData = 'admin/NotificationToAdminForProviderReassign'

export const postData = 'admin/providerReassign'

// Clinic Registration

export const ClinicAllData = 'v1/clinic/getAllClinics'

export const clinicPost = 'v1/clinic/addClinic'
