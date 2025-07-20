import React from "react";


function OfferBubble({ offer, currentUser, onAccept, onDecline }) {
  return (
    <div className="bg-gray-800 p-4 rounded flex justify-between items-center">
      <div>
        <p><strong>{offer.sender}</strong> offered ₹{offer.amount}</p>
        <p className="text-sm text-yellow-400 capitalize">{offer.status}</p>
      </div>
      {offer.status === "pending" && offer.sender !== currentUser && (
        <div className="space-x-2">
          <button className="bg-green-500 px-2 py-1 rounded" onClick={() => onAccept(offer._id)}>Accept</button>
          <button className="bg-red-500 px-2 py-1 rounded" onClick={() => onDecline(offer._id)}>Decline</button>
        </div>
      )}
    </div>
  );
}

export default OfferBubble;
