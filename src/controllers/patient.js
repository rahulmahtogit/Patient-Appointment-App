const User = require('../models/user')
const Doctor = require('../models/doctor')
const Appointment = require('../models/appointment')
const { validationResult } = require('express-validator')


exports.signup=  async (req,res)=>{

    const user = new User(req.body)
    await user.save()
    const token =  await user.generateToken()
    res.send({user,token})

    }

exports.signin = async (req,res)=>{
    
    const user = await User.findByCredentials(req.body.email,req.body.password)
    const token = await user.generateToken()
     res.send({user,token})
    
    }

exports.updateProfileUser = async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedupdate = [
        "name",
        "email",
        "password",
        "gender",
        "age"
    ]
    const isValidrequest = updates.every(upd => allowedupdate.includes(upd))
    if(!isValidrequest){
        res.status(400).send("Incorrect Input")
    }
    const user = req.user
    updates.forEach(update => {
        user[update] = req.body[update]
    })
    await user.save()
    res.send(user)
}

exports.listOfDoctor = async (req,res)=>{
    const doctor = await Doctor.find({})
    const doctorlist = doctor.map(x =>{
        return {name:x.name,
             role:x.role,
             experience:x.experience,
             address:x.address,
             description:x.description}
    })

    res.send(doctorlist)
    
}

exports.listOfDoctorBySpeciality = async (req,res)=>{
    try {
        const doctor = await Doctor.find({role:req.body.role})
    const doctorlist = doctor.map(doct => {
        return  {name:doct.name,
                role:doct.role,
                experience:doct.experience,
                address:doct.address,
                description:doct.description
        }  }  )
    res.send(doctorlist)
    } catch (error) {
        
        res.status(400).send()
    }
}


exports.signout = async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter(tok => tok.token !== req.token)
        await req.user.save()
        res.send("Logout Suceesfully")
    } catch (error) {
        res.status(400).send()
    }
}

exports.deleteProfileUser = async (req,res)=>{
   
    res.send(req.user)
}
 

