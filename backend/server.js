require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/portals", require("./routes/portalRoutes"));

// Initialize Real-Time Monitoring Engine
const monitorEngine = require("./services/monitorEngine")(io);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Connect monitor engine to portal routes
const portalRoutes = require("./routes/portalRoutes");
portalRoutes.setMonitorEngine(monitorEngine);
app.use("/api/portals", portalRoutes);

// Listen for portal changes and start/stop monitoring
const originalPost = portalRoutes.stack.find(r => r.route?.path === "/add" && r.route?.methods?.post);
const originalDelete = portalRoutes.stack.find(r => r.route?.path === "/:id" && r.route?.methods?.delete);

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
  console.log("🔍 Real-time monitoring engine active");
});
