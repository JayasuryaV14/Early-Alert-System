const router = require("express").Router();
const Portal = require("../models/Portal");

// Store reference to monitor engine functions
let monitorEngine = null;

// Function to set monitor engine (called from server.js)
router.setMonitorEngine = (engine) => {
  monitorEngine = engine;
};

router.get("/", async (req, res) => {
  try {
    const portals = await Portal.find();
    res.json(portals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const portal = await new Portal(req.body).save();
    
    // Start monitoring the new portal immediately
    if (monitorEngine && monitorEngine.startMonitoring) {
      monitorEngine.startMonitoring(portal._id.toString());
    }
    
    res.json(portal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const portalId = req.params.id;
    
    // Stop monitoring before deleting
    if (monitorEngine && monitorEngine.stopMonitoring) {
      monitorEngine.stopMonitoring(portalId);
    }
    
    await Portal.findByIdAndDelete(portalId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle email alerts for a portal
router.patch("/:id/toggle-alerts", async (req, res) => {
  try {
    const portal = await Portal.findById(req.params.id);
    if (!portal) {
      return res.status(404).json({ error: "Portal not found" });
    }
    
    portal.alertsEnabled = !portal.alertsEnabled;
    await portal.save();
    
    res.json({ 
      success: true, 
      alertsEnabled: portal.alertsEnabled,
      message: portal.alertsEnabled ? "Email alerts enabled" : "Email alerts disabled"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
