import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Offer from "./models/Offer.js";
import path from "path";

dotenv.config();
const app = express();
const server = http.createServer(app);

// ✅ Correct __dirname for ES modules
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigin = "https://money-negotiator-realtime.onrender.com";

const io = new Server(server, {
  cors: { origin: allowedOrigin },
});

app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST"],
}));

app.use(express.json());

// ✅ Serve static files
const distPath = path.join(__dirname, "../client/dist");
app.use(express.static(distPath));

// ✅ Test route
app.get("/test", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ Wildcard route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ Mongo connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
});

// ✅ Sockets
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("send_offer", async (data) => {
    const newOffer = new Offer(data);
    await newOffer.save();
    io.to(data.roomId).emit("receive_offer", newOffer);
  });

  socket.on("accept_offer", async ({ offerId, roomId }) => {
    const offer = await Offer.findByIdAndUpdate(offerId, { status: "accepted" }, { new: true });
    io.to(roomId).emit("offer_updated", offer);
  });

  socket.on("decline_offer", async ({ offerId, roomId }) => {
    const offer = await Offer.findByIdAndUpdate(offerId, { status: "declined" }, { new: true });
    io.to(roomId).emit("offer_updated", offer);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
