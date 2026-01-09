const ping = require("ping");
const axios = require("axios");
const Portal = require("../models/Portal");
const { sendAlert } = require("./emailServices");


const activeMonitors = new Map();

module.exports = (io) => {
  console.log("🔍 Real-time Monitoring Engine Started");

  async function startMonitoringAll() {
    const portals = await Portal.find();
    portals.forEach(portal => startMonitoring(portal._id.toString()));
  }

  async function monitorPortal(portalId) {
    try {
      const portal = await Portal.findById(portalId);
      if (!portal) {
        stopMonitoring(portalId);
        return;
      }

      const url = portal.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      
      const httpStart = Date.now();
      const protocol = url.includes(":") && !url.includes("://") ? "http" : "https";
      
      const [pingRes, httpResult] = await Promise.allSettled([
        
        ping.promise.probe(url, {
          timeout: 2,
          min_reply: 1
        }),
       
        axios.get(`${protocol}://${url}`, { 
          timeout: 2000,
          validateStatus: () => true
        }).catch(() => null)
      ]);

      const pingData = pingRes.status === 'fulfilled' ? pingRes.value : { alive: false, time: -1, packetLoss: 100 };
      const pingTime = pingData.alive ? (pingData.time || 0) : -1;
      const packetLoss = pingData.packetLoss || (pingData.alive ? 0 : 100);

      let responseTime = -1;
      if (httpResult.status === 'fulfilled' && httpResult.value) {
        responseTime = Date.now() - httpStart;
      }

      let status = "ONLINE";
      if (!pingData.alive || responseTime === -1 || pingTime === -1) {
        status = "OFFLINE";
      } else if (pingTime > 800 || responseTime > 2000 || packetLoss > 5) {
        status = "UNSTABLE";
      }

      portal.ping = pingTime;
      portal.response = responseTime;
      portal.packetLoss = packetLoss;
      portal.status = status;
      portal.lastChecked = new Date().toLocaleTimeString();
      await portal.save();

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

      if (status !== "ONLINE") {
        sendAlert(portal, status);
      }

    } catch (error) {
      console.error(`Error monitoring portal ${portalId}:`, error);
    }
  }

  function startMonitoring(portalId) {
    if (activeMonitors.has(portalId)) {
      return; // Already monitoring
    }

    monitorPortal(portalId);

    const interval = setInterval(() => {
      monitorPortal(portalId);
    }, 2000);

    activeMonitors.set(portalId, interval);
    console.log(`✅ Started monitoring portal: ${portalId}`);
  }

  
  function stopMonitoring(portalId) {
    if (activeMonitors.has(portalId)) {
      clearInterval(activeMonitors.get(portalId));
      activeMonitors.delete(portalId);
      console.log(`⏹️ Stopped monitoring portal: ${portalId}`);
    }
  }

  startMonitoringAll();

  return {
    startMonitoring,
    stopMonitoring,
    monitorPortal
  };
};
