const mongoose = require("mongoose");

const portalSchema = new mongoose.Schema({
  name: String,
  url: String,
  status: { type: String, default: "ONLINE" },
  ping: { type: Number, default: 0 },
  response: { type: Number, default: 0 },
  packetLoss: { type: Number, default: 0 },
  lastChecked: { type: String, default: "" },
  alertsEnabled: { type: Boolean, default: true },
  lastEmailSent: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Portal", portalSchema);
