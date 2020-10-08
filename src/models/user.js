const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { validationResult } = require('express-validator')
const userSchema = new mongoose.Schema({
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
    },
    gender:{
        type:String,
        trim:true

    },
    age:{
        type:Number,
        default:0
    },
    tokens:[{
        token:{
            type:String,
            required: true

        }
    }]
},{
    timestamps:true
})

userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})



userSchema.statics.findByCredentials = async function (email,password){

    const user =  await User.findOne({email})
    if(!user){
  throw new Error('Unable to Login')
    }
    const isMatch = bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("Unable to login")
    }
    return user

    
}

userSchema.methods.generateToken =  async function (){
    const user = this
  
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token:token})
    await user.save()
    return token
}


const User = mongoose.model('User',userSchema)
module.exports = User


