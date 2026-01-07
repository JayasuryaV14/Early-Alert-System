const express = require("express");
const router = express.Router();
const Outage = require("../models/Outages");
const { sendAlert } = require("../services/emailService");

router.post("/log", async (req, res) => {
  const { target, status, ping, time } = req.body;

  const entry = new Outage({ target, status, ping, time });
  await entry.save();

  if (status === "OFFLINE") {
    sendAlert(target, time);
  }

  res.json({ message: "Outage logged successfully" });
});

module.exports = router;
