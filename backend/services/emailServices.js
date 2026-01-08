const nodemailer = require("nodemailer");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendAlert = async (portal, reason) => {
  const users = await User.find({}, "email");
  const emails = users.map(u => u.email);

  if (emails.length === 0) return;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: emails.join(","),
    subject: `🚨 Network Outage Alert — ${portal.name}`,
    text: `Hello,

An outage has been detected.

Portal: ${portal.name}
URL: ${portal.url}
Issue: ${reason}
Time: ${new Date().toLocaleString()}

Please check the system dashboard for live updates.

— Early Alert System`
  });
};
