const express = require('express')
const { authentication,doctorAuthentication } = require('../middleware/authentication')
const {appointment,updateappointment,deleteappointment,patientAppointmentList,userAppointmentDatewise,userCompletedAppointment,
       upcomingAppointmentDoctor,doctorAppointmentDatewise,doctorCompletedAppointment,visitedAppointment,
    test} = require('../controllers/appointment')

const router = express.Router()

router.post('/patient/appointment',authentication,appointment)
router.patch('/patient/updateappointment',authentication,updateappointment)
router.delete('/patient/deleteappointment',authentication,deleteappointment)
router.post('/patient/appointmentList',authentication,patientAppointmentList)
router.post('/patient/userAppointmentDatewise',authentication,userAppointmentDatewise)
router.post('/patient/userCompletedAppointment',authentication,userCompletedAppointment)

router.post('/doctor/upcomingAppointmentDoctor',doctorAuthentication,upcomingAppointmentDoctor)
router.post('/doctor/doctorAppointmentDatewise',doctorAuthentication,doctorAppointmentDatewise)
router.post('/doctor/doctorCompletedAppointment',doctorAuthentication,doctorCompletedAppointment)
router.post('/doctor/visitedAppointment',doctorAuthentication,visitedAppointment)


router.post('/testing',test)
module.exports = router