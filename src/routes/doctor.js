const express = require('express')
const {doctorAuthentication} = require('../middleware/authentication')
const {signup,signin,updateProfileDoctor,createSlot,updateSlot,signout} = require('../controllers/doctor')

const router = express.Router()

router.post('/doctor/signup',signup)
router.post('/doctor/signin',signin)
router.post('/doctor/updateProfile',doctorAuthentication,updateProfileDoctor)
router.post('/doctor/createSlot',doctorAuthentication,createSlot)
router.patch('/doctor/updateSlot',doctorAuthentication,updateSlot)
router.post('/doctor/signout',doctorAuthentication,signout)


module.exports= router