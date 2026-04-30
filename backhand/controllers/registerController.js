const Register = require("../models/Register");

// 🎟️ REGISTER FOR EVENT
exports.registerEvent = async (req, res) => {
  try {
    const { studentName, email, eventId, eventTitle } = req.body;

    const already = await Register.findOne({ email, eventId });

    if (already) {
      return res.status(400).json("Already registered");
    }

    const registration = await Register.create({
      studentName,
      email,
      eventId,
      eventTitle,
    });

    res.json({ message: "Registered successfully", registration });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// 📋 GET ALL REGISTRATIONS (optional for organizer)
exports.getRegistrations = async (req, res) => {
  try {
    const data = await Register.find();
    res.json(data);
  } catch (err) {
    res.status(500).json(err.message);
  }
};