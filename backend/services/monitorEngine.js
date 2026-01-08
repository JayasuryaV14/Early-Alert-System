const ping = require("ping");
const axios = require("axios");
const Portal = require("../models/Portal");
const { sendAlert } = require("./emailServices");

// Store active monitoring intervals for each portal
const activeMonitors = new Map();

module.exports = (io) => {
  console.log("🔍 Real-time Monitoring Engine Started");

  // Start monitoring for all existing portals
  async function startMonitoringAll() {
    const portals = await Portal.find();
    portals.forEach(portal => startMonitoring(portal._id.toString()));
  }

  // Monitor a single portal - OPTIMIZED FOR SPEED
  async function monitorPortal(portalId) {
    try {
      const portal = await Portal.findById(portalId);
      if (!portal) {
        stopMonitoring(portalId);
        return;
      }

      const url = portal.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      
      // Run Ping and HTTP checks in PARALLEL for faster results
      const httpStart = Date.now();
      const protocol = url.includes(":") && !url.includes("://") ? "http" : "https";
      
      const [pingRes, httpResult] = await Promise.allSettled([
        // Real ICMP Ping - Reduced timeout to 2 seconds
        ping.promise.probe(url, {
          timeout: 2,
          min_reply: 1
        }),
        // Real HTTP Response Time - Reduced timeout to 2 seconds
        axios.get(`${protocol}://${url}`, { 
          timeout: 2000,
          validateStatus: () => true
        }).catch(() => null)
      ]);

      // Process ping result
      const pingData = pingRes.status === 'fulfilled' ? pingRes.value : { alive: false, time: -1, packetLoss: 100 };
      const pingTime = pingData.alive ? (pingData.time || 0) : -1;
      const packetLoss = pingData.packetLoss || (pingData.alive ? 0 : 100);

      // Process HTTP result
      let responseTime = -1;
      if (httpResult.status === 'fulfilled' && httpResult.value) {
        responseTime = Date.now() - httpStart;
      }

      // Determine status based on REAL measurements - Faster thresholds
      let status = "ONLINE";
      if (!pingData.alive || responseTime === -1 || pingTime === -1) {
        status = "OFFLINE";
      } else if (pingTime > 800 || responseTime > 2000 || packetLoss > 5) {
        status = "UNSTABLE";
      }

      // Update portal with REAL data
      portal.ping = pingTime;
      portal.response = responseTime;
      portal.packetLoss = packetLoss;
      portal.status = status;
      portal.lastChecked = new Date().toLocaleTimeString();
      await portal.save();

      // Emit real-time update via Socket.IO
      io.emit("portal-update", {
        _id: portal._id,
        name: portal.name,
        url: portal.url,
        status: portal.status,
        ping: portal.ping,
        response: portal.response,
        packetLoss: portal.packetLoss,
        lastChecked: portal.lastChecked,
        alertsEnabled: portal.alertsEnabled
      });

      // Send alert if status is not ONLINE (with 10-minute cooldown check inside sendAlert)
      if (status !== "ONLINE") {
        sendAlert(portal, status);
      }

    } catch (error) {
      console.error(`Error monitoring portal ${portalId}:`, error);
    }
  }

  // Start monitoring a specific portal
  function startMonitoring(portalId) {
    if (activeMonitors.has(portalId)) {
      return; // Already monitoring
    }

    // Monitor immediately
    monitorPortal(portalId);

    // Then monitor every 2 seconds for FAST updates
    const interval = setInterval(() => {
      monitorPortal(portalId);
    }, 2000);

    activeMonitors.set(portalId, interval);
    console.log(`✅ Started monitoring portal: ${portalId}`);
  }

  // Stop monitoring a specific portal
  function stopMonitoring(portalId) {
    if (activeMonitors.has(portalId)) {
      clearInterval(activeMonitors.get(portalId));
      activeMonitors.delete(portalId);
      console.log(`⏹️ Stopped monitoring portal: ${portalId}`);
    }
  }

  // Initialize monitoring for all portals
  startMonitoringAll();

  // Return control functions
  return {
    startMonitoring,
    stopMonitoring,
    monitorPortal
  };
};
