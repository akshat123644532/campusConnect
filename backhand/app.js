require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/Event");

const app = express();
const port = process.env.PORT || 5000;

// DB connect
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("CampusConnect API Running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});