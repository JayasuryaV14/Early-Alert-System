const router = require("express").Router();
const Portal = require("../models/Portal");

router.get("/", async (req, res) => {
  const portals = await Portal.find();
  res.json(portals);
});

router.post("/add", async (req, res) => {
  const portal = new Portal(req.body);
  await portal.save();
  res.json(portal);
});

router.delete("/:id", async (req, res) => {
  await Portal.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
