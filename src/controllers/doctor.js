const Doctor = require('../models/doctor')
const Slot = require('../models/slot')
const moment = require('moment')


exports.signup=  async (req,res)=>{

    const doctor = new Doctor(req.body)
    await doctor.save()
    const token =  await doctor.generateToken()
    res.send({doctor,token})

    }

exports.signin = async (req,res)=>{
    
    try {
        const doctor = await Doctor.findByCredentials(req.body.email,req.body.password)
   
    const token = await doctor.generateToken()
     res.send({doctor,token})
    
    }
    catch (error) {
       res.status(400).send("Unable to Login") 
    }
}
exports.updateProfileDoctor = async (req,res)=>{
    try {
    const updates = Object.keys(req.body)
    const allowedupdate = ["name","email","password","role","experience","address","description","fee"]
    const isValidRequest = updates.every(upd => allowedupdate.includes(upd))
    if(!isValidRequest){
        res.status(400).send({e:"Please check your input"})
    }
    const doctor = req.doctor
    updates.forEach(update => doctor[update] = req.body[update])
    await doctor.save()
    res.send(doctor)
    } catch (error) {
        res.status(400).send("Profile not updated")
        
    }

}

exports.createSlot = async (req,res)=>{
    const slot = await Slot.findOne({doctorid:req.body.doctorid})
    const adate = moment.utc(req.body.availableSlot[0]).date()

    if(slot){

        const isDateexist = slot.dates.find(chedate => chedate.availableDate === adate)
           
        if(isDateexist){
            let a = isDateexist.availableSlot
            let b = JSON.stringify(a)
            const n_Slot = req.body.availableSlot.filter(val => !b.includes(val))
            const newlySlot = a.concat(n_Slot)
            const filter = {doctorid:req.body.doctorid,'dates.availableDate':adate}

        //    const avaslotobj = {
        //     availableDate:adate,
        //     availableSlot:req.body.availableSlot

        // }
           
            const update = {"$set":{"dates.$": 
            {availableDate: adate, availableSlot:newlySlot } }}
            const slot1 = await Slot.findOneAndUpdate(filter,update,{new:true,runValidators:true})
            // const slot1 = await Slot.findOneAndUpdatefindOne(filter)
            
            res.send(slot1)

            
        }
        else{
            
            const filter = {doctorid:req.body.doctorid}
           
            const avaslotobj = {
            availableDate:adate,
            availableSlot:req.body.availableSlot

        }

            const update = {"$push":{dates: avaslotobj}}
           
            const updslot = await Slot.findOneAndUpdate(filter,update,{new :true,runValidators:true})
            res.send(updslot)
        }

        // const givendate = new Date(date[0]).getDate()
        // if(givendate === dates.date){

        // }
        // const filter = {doctorid:req.doctor._id}
        // const updslot = await Slot.findOneAndUpdate(filter,{"$push":{availableSlots: req.body.availableSlot}})

    }else{

        
        const avaslotobj = {
            availableDate:adate,
            availableSlot:req.body.availableSlot

        }
        const datesobj = {
            doctorid:req.body.doctorid,
            dates:[avaslotobj]

        }
        const slot = new Slot(datesobj)
        await slot.save()
        res.send(slot)
     
    }
}

exports.updateSlot = async (req,res)=>{
    try {
        const filter = {doctorid:req.doctor._id}
    const targetSlot = await Slot.findOne(filter)
    if(!targetSlot){
        res.status(400).send("Slot is not available")
    }
    const dateOfUpdatedSlot = moment.utc(req.body.availableSlot[0]).date()
    const tslotdate = targetSlot.dates
    for (x in tslotdate){
        if (tslotdate[x].availableDate == req.body.availableDate){
            tslotdate[x].availableSlot = req.body.availableSlot
            tslotdate[x].availableDate = dateOfUpdatedSlot
        }
    }
    await targetSlot.save()
    res.send(targetSlot)
    } catch (error) {
        res.status(400).send()
    }

}



exports.signout = async (req,res)=>{
    try {
        req.doctor.tokens = req.doctor.tokens.filter(x => x.token !== req.token)
        await req.doctor.save()
        res.send(req.doctor)
    } catch (error) {
        res.status(400).send()
    }
    
}













// let date = new Date()
// console.log(date.toJSON())


// console.log(date.getMinutes())
// console.log(new Date("2020-09-29T05:48:52.092+00:00").getTime())

// // console.log(new Date("2020-09-29T05:48:52.092+00:00").getTime())
// console.log(new Date("2020-09-29T05:48").getTime())
// let date1 = Date.parse("2020-10-06T06:00:00.000+00:00")
// console.log(date1)
// let date2 = new Date("2020-10-06T06:00:00.000+00:00")
// let date3 = "2020-10-06T09:00:00.000+00:00"
// console.log(date2.toISOString())
// const a = date3.replace("+00:00",'Z')
// console.log(a)
// new Date(1601964000000).getDate()
// console.log(new Date(1601964000000).getDate())

// let hy = [
//     "2020-10-12T13:00:00.000Z",
//     "2020-10-11T14:00:00.000Z",
//     "2020-10-11T19:00:00.000Z"
// ]

// console.log(moment.utc("2020-10-12T13:00:00.000Z").toISOString())
// let m = moment()
// console.log(m.toString())
// console.log(m)
// console.log(m.toISOString())
// let m = moment("2020-10-05T11:12:55.810+0400")
// console.log(m.toString())
// console.log(m.toISOString())

// let m = moment("12/09/2020 4:49PM", "DD/MM/YYYY h::mm:A")
// console.log(m.toString())
// console.log(m.toISOString())

// Create Using millisecond
// let m = moment(10*3600*1000)
// console.log(m.toString())
// console.log(m.toISOString())

// // Create Using Seconds
// let m = moment.unix(10*60)
// console.log(m.toString())
// console.log(m.toISOString())

// Create a moment Object in utc mode
// let m = moment.utc() //or m = moment.utc("2020-10-05T11:29:30.954Z")
// console.log(m.toString())
// console.log(m.toISOString())

// Getting units of time
// let m = moment() //or m = moment.utc("2020-10-05T11:29:30.954Z")
// console.log(m.toString())
// console.log(m.toISOString())
// console.log(m.minutes())
// console.log(m.hour())
// console.log(m.week())
// console.log(m.get('date'))//or m.date()
// console.log(m.date())
// console.log(m.get('quarter')) //or m.quarter()

// Setting units of time
// let m = moment() //or m = moment.utc("2020-10-05T11:29:30.954Z")
// m.minutes(29) //minutes set to 29 
// m.hour(14) //hour set to 14
// m.week(3) //week set to 3 of year
// m.set('day',4) //day set to 4 of 3rd week
// m.set('day',9) //day set to 1 of 4th week
// console.log(m.toString())


// Min and Max bw two moment
// let m = moment()
// let m1 = moment("2020-10-06T11:09:13.640Z")
// console.log(moment.max(m,m1).toISOString())//Return max moment
// console.log(moment.min(m,m1).toISOString())//Return min moment

//Manipulating moment add subtract startof utc local 
// let m = moment()
// console.log(`Before Manipulation : ${m.toString()}`)
// m.add(5,'days').add(7,'hours') // or add Multiple in chaining
// m.add({
//     'days':4,
//     'hours':10

// }) // or add Multiple in chaining
// m.subtract(4,'days').subtract(10,'hours')
// m.subtract({
//     'days':4,
//     'hours':10

// }) 
// m.startOf('hours') //Start from 17:00:00
// m.startOf('day') //Start from 00:00:00
// m.endOf('hours') // end of 17:59:59
// m.endOf('days') // end of 23:59:5
// Before Manipulation : Mon Oct 05 2020 17:44:51 GMT+0530
// After Manipulation : Mon Oct 05 2020 17:00:00 GMT+0530

// m.utc() // Change the data in UTC format
// m.local()//change in Local format
// console.log(m.utcOffset()) // return 330 minutes after utc is your local time
// m.utcOffset(5) // set utc +5:00
// m.utcOffset(300) // set utc +5:00 read as (60*5)
// m.utcOffset("+03:30") // set utc +03:30
// m.utcOffset("-03:30") // set utc -03:30


// console.log(`After Manipulation : ${m.toString()}`)


// let m = moment()
// console.log(m.format("dddd, MMMM Do YYYY, h:mm:ss A")) // Check display option
// console.log(m.format("[Today is] dddd, MMMM Do YYYY, h:mm:ss A")) //Today is Monday, October 5th 2020, 6:23:45 PM
// console.log(m.format("L")) //10/05/2020 in local format

// let m1 = moment("2020-02-17") // 5 days ago
// let m1 = moment("2020-10-17T17:00:20+05:30") // in 12 days 
// console.log(m1.fromNow()) 
// console.log(m.diff(m1)) // 413612965 millisec
// console.log(m.diff(m1,'days')) // 4 days differnce
// console.log(m.diff(m1,'days',true)) // 4.78846130787037 days differnce

// console.log(m.calendar()) // Today at 6:51 PM
// console.log(m.valueOf()) // value in millisec 1601904407117
// console.log(m.unix()) // value in sec 1601904581
// console.log(m1.daysInMonth()) //29



// Time in Json
// let m = moment()
// let m1 = moment("2020-02-17")
// console.log(JSON.stringify(m)) // convert date object in JSON format



// //Querying the date object
// console.log(moment("2020-10-07T09:00:00.000Z").isSame("2020-10-07T09:00:00.000+00:00")) //true
// console.log(moment("2020-10-07T09:00:00.000Z").isSame(moment("2020-10-07T09:00:00.000+00:00"))) //true
// console.log(moment("2020-10-07T09:00:00.000Z").isSame("2020-10-07T09:00:00.001+00:00")) //false
// console.log(moment("2020-10-07T09:00:00.000Z").isSame("2020-10-07T09:39:10.001+00:00",'hour')) //true #  8:30-9:29 ko true return karega  
// console.log(moment("2020-10-07T09:00:00.000Z").isSame("2020-10-06T08:30:10.001+00:00",'hour')) //false #  date ko check karega 
// console.log(moment.utc("2020-10-07T09:00:00.000Z").isSame ("2020-10-07T01:59:10.001+00:00",'days')) 
// console.log(moment("2020-10-07T09:00:00.000Z").isBefore("2020-10-07T09:01:10.001+00:00")) //true
// console.log(moment("2020-10-06T09:00:00.000Z").isBefore("2020-10-07T09:01:10.001+00:00",'day')) //true
// console.log(moment("2020-10-06T09:00:00.000Z").isAfter("2020-10-07T09:01:10.001+00:00",'day')) //false
// console.log(moment("2020-10-07T09:00:00.000Z").isSameOrAfter("2020-10-07T09:00:00.000+00:00")) //true

// let m = moment()
// let m1 = moment("2020-10-04T09:01:00.000Z")
// let m2 = moment("2020-10-07T09:00:00.000+00:00")
// console.log(m.isBetween(m1,m2)) //true


// let dur;
// // dur = moment.duration(500000) // 8 minutes
// // dur = moment.duration(3,'day') // 3 days
// // console.log(dur.humanize())
// console.log(moment.duration(2,'weeks').days())//14