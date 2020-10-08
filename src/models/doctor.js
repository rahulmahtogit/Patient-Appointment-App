const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { validationResult } = require('express-validator')
const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }

    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.length < 6){
                throw new Error('Password must be 6 character long')
            }
        }
    }, role:{
        type:String,
        required:true,
        trim:true
    },
    experience:{
        type:Number,
        required:true,
        trim:true
    },
    address:{
type:String,
trim:true
    },
    fee:{
        type:Number,
    },
    totalEarning:{
        type:Number,
        default:0
    },
    description:{
        type:String,trim:true
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }]
},{timestamps:true})

doctorSchema.pre('save',async function(next){
    const doctor = this
    if(doctor.isModified('password')){
        doctor.password = await bcrypt.hash(doctor.password,8)
    }
    next()
})


doctorSchema.statics.findByCredentials = async function (email,password){

    const doctor =  await Doctor.findOne({email})
  
    if(!doctor){
      throw new Error('Unable to Login') 
    }
    const isMatch = bcrypt.compare(password,doctor.password)
    if(!isMatch){
        throw new Error("Unable to login")
    }
    return doctor

    console.log(doctor)

    
}

doctorSchema.methods.generateToken =  async function (){
    const doctor = this
  
    const token = jwt.sign({_id:doctor._id.toString()},process.env.JWT_SECRET)
    doctor.tokens = doctor.tokens.concat({token:token})
    await doctor.save()
    return token
}


const Doctor = mongoose.model('Doctor',doctorSchema)
module.exports = Doctor


   



