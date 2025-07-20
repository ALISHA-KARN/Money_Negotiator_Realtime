import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import OfferBubble from "./OfferBubble";
import { APIUrl } from '../utils/api';


const socket = io(APIUrl);

function NegotiationRoom({ user, setUser }) {
  const [amount, setAmount] = useState("");
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    socket.emit("join_room", user.roomId);

    socket.on("receive_offer", (offer) => {
      setOffers((prev) => [...prev, offer]);
    });

    socket.on("offer_updated", (updated) => {
      setOffers((prev) =>
        prev.map((offer) => (offer._id === updated._id ? updated : offer))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const sendOffer = () => {
    if (!amount) return;
    socket.emit("send_offer", {
      sender: user.name,
      amount: parseInt(amount),
      roomId: user.roomId,
    });
    setAmount("");
  };

  const handleAccept = (id) => {
    socket.emit("accept_offer", { offerId: id, roomId: user.roomId });
  };

  const handleDecline = (id) => {
    socket.emit("decline_offer", { offerId: id, roomId: user.roomId });
  };

  const handleLogout = () => {
    localStorage.removeItem("negotiationUser");
    setUser({ name: "", roomId: "" }); // Go back to JoinSession
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white p-6"
      style={{ backgroundImage: "url('/bg4.jpg')" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Room: {user.roomId}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-4 flex gap-4 max-w-xl">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter your offer"
          className="bg-gray-800 p-2 rounded w-full"
        />
        <button
          onClick={sendOffer}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Send Offer
        </button>
      </div>

      <div className="space-y-3 max-w-xl">
        {offers.map((offer) => (
          <OfferBubble
            key={offer._id}
            offer={offer}
            currentUser={user.name}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))}
      </div>
    </div>
  );
}

export default NegotiationRoom;

