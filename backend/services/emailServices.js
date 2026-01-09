const nodemailer = require("nodemailer");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

exports.sendAlert = async (portal, status) => {
  try {
    // Check if alerts are enabled for this portal
    if (portal.alertsEnabled === false) {
      return; // Alerts disabled for this portal
    }

    // Check if 10 minutes (600000 ms) have passed since last email
    const now = new Date();
    const lastEmailTime = portal.lastEmailSent ? new Date(portal.lastEmailSent) : null;
    const tenMinutesInMs = 10 * 60 * 1000; // 10 minutes

    if (lastEmailTime && (now - lastEmailTime) < tenMinutesInMs) {
      // Less than 10 minutes since last email - skip sending
      return;
    }

    const users = await User.find();
    if (users.length === 0 && (!portal.additionalEmails || portal.additionalEmails.length === 0)) return;

    // Base recipients: all registered users
    const userEmails = users.map(u => u.email);

    // Additional recipients configured per portal
    const extraEmails = Array.isArray(portal.additionalEmails)
      ? portal.additionalEmails
      : portal.additionalEmails
      ? String(portal.additionalEmails).split(",").map(e => e.trim()).filter(Boolean)
      : [];

    // Merge and deduplicate
    const allEmails = [...new Set([...userEmails, ...extraEmails])];
    if (allEmails.length === 0) return;
    
    const statusEmoji = status === "OFFLINE" ? "🔴" : "⚠️";
    const subject = `${statusEmoji} Alert: ${portal.name} - ${status}`;
    
    const text = `
🚨 NETWORK MONITORING ALERT

Portal: ${portal.name}
URL: ${portal.url}
Status: ${status}
Ping: ${portal.ping}ms
Response Time: ${portal.response}ms
Packet Loss: ${portal.packetLoss}%
Time: ${portal.lastChecked}

This is an automated alert from the Early Alert System.
    `.trim();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: allEmails.join(", "),
      subject: subject,
      text: text
    });

    // Update lastEmailSent timestamp in database
    portal.lastEmailSent = now;
    await portal.save();

    console.log(`📧 Alert email sent for ${portal.name} - ${status}`);
  } catch (error) {
    console.error("Error sending alert email:", error);
  }
};
