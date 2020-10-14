const express = require('express')
const mongoose = require('mongoose')
const env = require('dotenv')
const patientRoutes = require('./routes/patient')
const doctorRoutes = require('./routes/doctor')
const appointmentRoutes = require('./routes/appointment')

const app = express()
env.config()



mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.talqj.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(()=>{
    console.log("Database Connected")
})


// app.use(async function (req, res, next) {
//   const user = await User.findById("5f79e3e78f62c11c70b59167")
//   res.status(503).send({mess:"You are logout from device",
//   user})
//   // if(req.method === 'POST'){
//   //   res.send("POST request is disabled")
//   // }
//   // else{
//   //   next()
//   // }  
// })

app.use(express.json())
app.use(patientRoutes)
app.use(doctorRoutes)
app.use(appointmentRoutes)



app.listen(process.env.PORT,()=>{
    console.log(`server is connected on ${process.env.PORT}`)
})