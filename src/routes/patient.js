const express = require('express')
const {authentication} = require('../middleware/authentication')
const {signup,signin,updateProfileUser,listOfDoctor,listOfDoctorBySpeciality,
    deleteProfileUser,signout} = require('../controllers/patient')

const router = express.Router()

router.post('/patient/signup',signup)
router.post('/patient/signin',signin)
router.post('/patient/updateProfile',authentication,updateProfileUser)
router.get('/patient/listOfDoctors',listOfDoctor)
router.post('/patient/listOfDoctorBySpeciality',listOfDoctorBySpeciality)
router.delete('/patient/deleteProfile',authentication,deleteProfileUser)
router.post('/patient/signout',authentication,signout)
    
module.exports= router