const mongoose = require('mongoose')
const validator = require('validator')

const slotSchema = new mongoose.Schema({
    doctorid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor'
    },
    
    dates:[
    {availableDate:{
        type:Number
    },
        availableSlot:[{
        type:Date,
        // validate(value){
        //     const chosendate = new Date(value).getTime() 
        //     const maxavailability = new Date().getTime() + (90*24*60*60*1000)
        //     if(chosendate > maxavailability){
        //         throw new Error('You can\'t choose any date after 3 Months')
        //     }
        // }

    }],
    // fulfill :{type:Boolean,default:false}
   }
    ]
    
    
    },{timestamps:true})
const Slot = mongoose.model('Slot',slotSchema)

module.exports = Slot