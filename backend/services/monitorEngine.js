const ping = require("ping");
const axios = require("axios");
const Portal = require("../models/Portal");
const { sendAlert } = require("./emailService");

module.exports = async (io) => {

  setInterval(async () => {
    const portals = await Portal.find();

    for (let portal of portals) {
      const pingRes = await ping.promise.probe(portal.url);
      const start = Date.now();

      let responseTime = 0;
      try {
        await axios.get(`https://${portal.url}`, { timeout: 5000 });
        responseTime = Date.now() - start;
      } catch {
        responseTime = -1;
      }

      const packetLoss = pingRes.packetLoss;
      let status = "ONLINE";

      if (!pingRes.alive || responseTime === -1) status = "OFFLINE";
      else if (pingRes.time > 1000 || packetLoss > 5) status = "UNSTABLE";

      portal.ping = pingRes.time;
      portal.response = responseTime;
      portal.packetLoss = packetLoss;
      portal.status = status;
      portal.lastChecked = new Date().toLocaleTimeString();
      await portal.save();

      io.emit("portal-update", portal);

      if (status !== "ONLINE") {
        sendAlert(portal, status);
      }
    }

  }, 5000);
};
