const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// ── SIGNUP ──
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send("Name, email, and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already registered");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

    res.send("User Registered Successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ── LOGIN ── ✅ email + role token mein, user object response mein
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const user = await User.findOne({ email });
    const checkPassword = user && (await bcrypt.compare(password, user.password));

    if (!user || !checkPassword) {
      return res.status(400).send("Invalid email or password");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email, // ✅ email token mein
        role: user.role,   // ✅ role token mein
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // ✅ role frontend ko bhejna
      },
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ── PROFILE ──
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;