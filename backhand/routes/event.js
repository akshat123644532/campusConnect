const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const register = require("../models/register"); 
const nodemailer = require("nodemailer");
const auth = require("../middleware/auth");
const isOrganizer = require("../middleware/isOrganizer"); // ✅ import

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── CREATE EVENT — sirf organizer ✅
router.post("/create", auth, isOrganizer, async (req, res) => {
  try {
    const { title, description, date, venue } = req.body;

    if (!title || !date || !venue) {
      return res.status(400).send("Title, date, and venue are required");
    }

    const newEvent = new Event({
      title,
      description,
      date,
      venue,
      createdBy: req.userId,
    });
    await newEvent.save();

    res.status(201).json({ message: "Event Created Successfully", event: newEvent });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ── GET ALL EVENTS — public
router.get("/all", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ── REGISTER FOR EVENT — student
router.post("/register", auth, async (req, res) => {
  try {
    const { studentName, eventId } = req.body;
    const email = req.userEmail;

    if (!studentName || !eventId) {
      return res.status(400).send("studentName and eventId are required");
    }

    const existingRegistration = await Register.findOne({ email, eventId });
    if (existingRegistration) {
      return res.status(409).send("You already registered for this event");
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).send("Event not found");

    const newRegister = new Register({ studentName, email, eventId });
    await newRegister.save();

    res.send("Event Registered Successfully");

    transporter
      .sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Event Registration Successful",
        text: `Hello ${studentName},\n\nYou have successfully registered for ${event.title}.\n\nThank you,\nCampusConnect Team`,
      })
      .catch((err) => console.error("Email failed for:", email, err.message));
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ── MY REGISTRATIONS — student
router.get("/my", auth, async (req, res) => {
  try {
    const data = await Register.find({ email: req.userEmail }).populate(
      "eventId",
      "title date venue"
    );
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ── CANCEL REGISTRATION — student (apni hi)
router.delete("/cancel/:id", auth, async (req, res) => {
  try {
    const registration = await Register.findById(req.params.id);
    if (!registration) return res.status(404).send("Registration not found");
    if (registration.email !== req.userEmail) {
      return res.status(403).send("Unauthorized");
    }
    await registration.deleteOne();
    res.send("Registration Cancelled");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ── PARTICIPANTS LIST — sirf organizer ✅
router.get("/participants/:eventId", auth, isOrganizer, async (req, res) => {
  try {
    const data = await Register.find({ eventId: req.params.eventId });
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ── DELETE EVENT — sirf organizer, registrations bhi delete ✅
router.delete("/delete/:id", auth, isOrganizer, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).send("Event not found");

    await Register.deleteMany({ eventId: req.params.id });
    res.send("Event Deleted Successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;