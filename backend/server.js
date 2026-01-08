require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/portals", require("./routes/portalRoutes"));

require("./services/monitorEngine")(io);

server.listen(5000, () => console.log("Server running on port 5000"));
