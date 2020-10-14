const jwt = require('jsonwebtoken')
const Doctor = require('../models/doctor')
const User = require('../models/user')


exports.authentication = async (req, res, next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})
        
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
        
    } catch (error) {
        res.status(400).send({message:"User Authentication Failed"})
        
    }
   
    
}

exports.doctorAuthentication = async function(req,res,next){
    try {
    const token = req.header('Authorization').replace('Bearer ','')
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    const doctor = await Doctor.findOne({_id:decoded._id,'tokens.token':token})
    if(!doctor){
        throw new Error({error:"Doctor Authentication Failed"})
    }
    req.token = token 
    req.doctor = doctor
    next()
    } catch (error) {
        res.status(400).send("Authentication Fail")
        
    }
}