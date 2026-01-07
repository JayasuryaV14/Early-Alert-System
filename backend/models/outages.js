const mongoose = require("mongoose");

const outageSchema = new mongoose.Schema({
  target: String,
  status: String,
  ping: String,
  time: String
});

module.exports = mongoose.model("Outages", outageSchema);
