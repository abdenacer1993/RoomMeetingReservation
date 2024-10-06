const mongoose = require('mongoose');

const salleSchema = new mongoose.Schema({
  name: { type: String, uppercase: true, trim: true, required: true },
  roomSize: { type: Number, trim: true, required: true },
  roomLocalisation: { type: String, trim: true, required: true },
  roomPrice: { type: String, trim: true, required: true }, // Make roomPrix optional by removing required: true
  roomDescription: { type: String, trim: true, required: true },
  disponible: { type: Boolean, default: true },
  createdOn: { type: Date, default: Date.now },
  dateReservation: { type: Date, default: null },
  files: {}, // Change the pic field to an array of strings
  
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
});

const Salle = mongoose.model('Salle', salleSchema);

module.exports = Salle;