const mongoose = require("mongoose");

const portalSchema = new mongoose.Schema({
  name: String,
  url: String,
  status: { type: String, default: "UNKNOWN" },
  ping: Number,
  response: Number,
  packetLoss: Number,
  lastChecked: String
});

module.exports = mongoose.model("Portal", portalSchema);
