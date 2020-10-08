const Appointment = require('../models/appointment')
const User = require('../models/user')
const moment = require('moment')

exports.appointment = async (req, res) => {
    try {
        const userexist = await Appointment.findOne({ userid: req.user._id })

        if (userexist) {
            const filter = { userid: req.user._id }
            const update = {
                "$push": {
                    doctors: {
                        doctorid: req.body.doctorid,
                        bookedslot: moment.utc(req.body.bookedslot)
                    }

                }
            }
            const ap = await Appointment.findOneAndUpdate(filter, update, { new: true, runValidators: true })
            res.send(ap)

        } else {
            const appointmentobj = {
                userid: req.user._id,
                doctors: {
                    doctorid: req.body.doctorid,
                    bookedslot: moment.utc(req.body.bookedslot)
                }
            }
            const appointment = new Appointment(appointmentobj)
            await appointment.save()
            res.send(appointment)
        }
    } catch (error) {
        res.status(400).send()
    }
}

exports.updateappointment = async (req, res) => {
    try {
        const filter = { userid: req.user._id, 'doctors._id': req.body._id, }
        const appointment = await Appointment.findOne(filter)
        if (!appointment) {
            res.status(404).send("Data Not found")
        }
        const updates = Object.keys(req.body)
        appointment.doctors = appointment.doctors.find(x => {
            return x._id == req.body._id
        })
        updates.forEach(update => {
            appointment.doctors[0][update] = req.body[update]
        })
        await appointment.save()
        res.send(appointment.doctors)
    } catch (error) {
        res.status(400).send()
    }

}

exports.deleteappointment = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ userid: req.user._id })
        const arr_doctors = appointment.doctors
        for (x in arr_doctors) {
            if (arr_doctors[x]._id == req.body._id) {
                arr_doctors.splice(x, 1)
            }
        }
        await appointment.save()
        res.send(appointment.doctors)
    } catch (error) {
        res.status(400).send()

    }
}

exports.patientAppointmentList = async (req,res)=>{
    try {
        const appointmentList = await Appointment.findOne({userid:req.user._id})
    await appointmentList.populate('doctors.doctorid').execPopulate()
    res.send(appointmentList)
    } catch (error) {
        res.status(400).send()
    }
}

exports.userAppointmentDatewise = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ userid: req.user._id })
        appointment.doctors = appointment.doctors.filter(x => {
            return moment.utc(x.bookedslot).isSame(req.body.bydate, 'days')
        })
        if (!appointment.doctors) {
            return res.status(200).send('No Data Found on this date')
        }
        await appointment.populate('doctors.doctorid').execPopulate()
        const filterappointent = appointment.doctors.map(x => {
            return {
                appointmentid: x._id,
                bookedSlot: x.bookedslot,
                doctorid: x.doctorid._id,
                name: x.doctorid.name,
                role: x.doctorid.role,
                experience: x.doctorid.experience,
                experience: x.doctorid.experience,
            }
        })
        res.send(filterappointent)
    } catch (error) {

        res.status(400).send()
    }
}

exports.upcomingAppointmentDoctor = async (req, res) => {
    try {
        const appointment = await Appointment.find({ 'doctors.doctorid': req.doctor._id, 'doctors.scheduled': true }).populate('userid', 'name')

        for (let ind in appointment) {

            appointment[ind].doctors = appointment[ind].doctors.filter((x) => {
                return x.doctorid == req.doctor._id.toString()
            })

        }
        let listofappoint = []
        for (let ind1 of appointment) {
            for (let ind2 of ind1.doctors) {
                listofappoint.push({ appointmentslot: moment(ind2.bookedslot).valueOf(), username: ind1.userid.name })

            }
        }
        listofappoint.sort(function (left, right) {
            return moment.utc(left.appointmentslot).diff(moment(right.appointmentslot))
        })

        res.send(listofappoint)
    } catch (error) {
        res.status(400).send()

    }

}

exports.userCompletedAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.find({ userid: req.user._id, 'doctors.completed': true })
        res.send(appointment)
    } catch (error) {
        res.status(400).send()

    }
}

exports.doctorCompletedAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.find({ 'doctors.doctorid': req.doctor._id, 'doctors.completed': true }).populate('userid', 'name')

        for (let ind in appointment) {

            appointment[ind].doctors = appointment[ind].doctors.filter((x) => {
                return x.doctorid == req.doctor._id.toString()
            })

        }
        let listofappoint = []
        for (let ind1 of appointment) {
            for (let ind2 of ind1.doctors) {
                listofappoint.push({ appointmentslot: moment(ind2.bookedslot).valueOf(), username: ind1.userid.name })

            }
        }
        listofappoint.sort(function (left, right) {
            return moment.utc(left.appointmentslot).diff(moment(right.appointmentslot))
        })

        res.send(listofappoint)
    } catch (error) {
        res.status(400).send()

    }
}

exports.doctorAppointmentDatewise = async (req, res) => {
    const appointment = await Appointment.find({ 'doctors.doctorid': req.doctor._id }).populate('userid', 'name')

    for (let ind in appointment) {

        appointment[ind].doctors = appointment[ind].doctors.filter((x) => {
            return x.doctorid == req.doctor._id.toString()
        })

    }
    let listofappoint = []
    for (let ind1 of appointment) {
        for (let ind2 of ind1.doctors) {
            listofappoint.push({ appointmentslot: ind2.bookedslot, username: ind1.userid.name })
        }
    }
    listofappoint.sort(function (left, right) {
        return moment.utc(left.appointmentslot).diff(moment(right.appointmentslot))
    })
    listofappoint = listofappoint.filter(datewise =>
        moment.utc(datewise.appointmentslot).isSame(req.body.filterdate, 'days'))
    if (listofappoint.length === 0) {
        res.status(404).send("No Appointment for Today")
    }

    res.send(listofappoint)
}


exports.visitedAppointment = async (req, res) => {

    try {
        const filter = { userid: req.body.userid, 'doctors._id': req.body.appointmentid}
        const appointment = await Appointment.findOne(filter)
        if (!appointment) {
            res.status(404).send("Data Not found")
        }
 
        appointment.doctors = appointment.doctors.find(x => {
            return x._id == req.body.appointmentid
        })

        appointment.doctors[0].completed = true,
            appointment.doctors[0].scheduled = false

        await appointment.save()
        const doc = req.doctor     
        doc.totalEarning = doc.totalEarning + doc.fee
        await doc.save()
        res.send({doc,appointment})

    } catch (error) {
        res.status(400).send()
    }

}




exports.test = async (req, res) => {
    const ap = await Appointment.find({})
    res.send(arr)
}
