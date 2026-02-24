const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, trim: true, required: true },
  dateNais: { type: String, required: true },
  email: { type: String, lowerCase: true },
  password: { type: String, required: true },
  phoneNumber: { type: Number, required: true },
  role: {
    type: String,
    enum: ["user", "superAdmin"],
    default: "user",
  },

});

module.exports = User = mongoose.model("user", userSchema);
