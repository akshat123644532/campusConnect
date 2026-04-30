const isOrganizer = (req, res, next) => {
  if (req.userRole !== "organizer") {
    return res.status(403).send("Access denied: Organizers only");
  }
  next();
};

module.exports = isOrganizer;