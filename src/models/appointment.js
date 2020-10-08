const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    doctors:[{
        doctorid:{type:mongoose.Schema.Types.ObjectId,
            ref:'Doctor'},
        bookedslot:{
            type:Date,
            
        },
        scheduled:{
      type:Boolean,
      default:true
    },
    completed:{
        type:Boolean,
        default:false
    }
    }]

    
    
    
    },{timestamps:true})
const Appointment = mongoose.model('Appointment',appointmentSchema)

module.exports = Appointment