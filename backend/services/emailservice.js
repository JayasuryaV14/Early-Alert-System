const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_EMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD"
  }
});

exports.sendAlert = (target, time) => {
  transporter.sendMail({
    from: "YOUR_EMAIL@gmail.com",
    to: "ADMIN_EMAIL@gmail.com",
    subject: "🚨 Network Outage Alert",
    text: `Outage detected on ${target} at ${time}`
  }, (err, info) => {
    if (err) console.log(err);
    else console.log("Email sent:", info.response);
  });
};
