const mongoose = require('mongoose')

const reservationSchemas = new  mongoose.Schema({

    name:  { type: String, uppercase: true, trim: true, required: true },
    createdOn : {type : Date , default : Date.now},
    dateReservation :{type : Date ,  default : null},
    idSalle : {type : String , required: true},
    user:{type:mongoose.Schema.Types.ObjectId,ref:"user"}
});

module.exports=mongoose.model("reservations",reservationSchemas);