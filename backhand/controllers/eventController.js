const Event = require("../models/Event");

// 📌 GET ALL EVENTS
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ➕ CREATE EVENT (organizer only)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, venue } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      venue,
      createdBy: req.user.id, // 👈 organizer id
    });

    res.json({ message: "Event created", event });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ❌ DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await Event.findByIdAndDelete(id);

    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json(err.message);
  }
};