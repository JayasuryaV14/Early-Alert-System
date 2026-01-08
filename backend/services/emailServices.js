const nodemailer = require("nodemailer");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

exports.sendAlert = async (portal, status) => {
  try {
    const users = await User.find();
    if (users.length === 0) return;

    const emails = users.map(u => u.email).join(", ");
    
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
      to: emails,
      subject: subject,
      text: text
    });

    console.log(`📧 Alert email sent for ${portal.name} - ${status}`);
  } catch (error) {
    console.error("Error sending alert email:", error);
  }
};
