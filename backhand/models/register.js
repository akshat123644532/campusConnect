const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  studentName: String,
  email: String,
  eventId: String,
  eventTitle: String
});

module.exports = mongoose.model("Register", registerSchema);