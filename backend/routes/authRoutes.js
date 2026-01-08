const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.json({ success: false });

  const exist = await User.findOne({ email });
  if (exist) return res.json({ success: false });

  await new User({ name, email, password }).save();
  res.json({ success: true });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (!user) return res.json({ success: false });
  res.json({ success: true });
});

module.exports = router;
