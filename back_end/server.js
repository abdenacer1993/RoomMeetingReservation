const express = require('express')
const cors=require("cors")
const app = express()
const connectDB = require('./config/connectDB')

require('dotenv').config();

app.use(cors())
app.use(express.json())

connectDB()


app.use("/uploads", express.static(__dirname + "/uploads"));


//console.log(process.env)

app.use("/users",require('./routes/usersRoutes'))
app.use("/salles",require('./routes/salleRoutes'))
app.use('/reservations',require('./routes/reservationRoutes'));


const port = 5000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))