// server/models/Offer.js
import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  sender: String,
  amount: Number,
  status: { type: String, default: "pending" },
  roomId: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Offer", offerSchema);

