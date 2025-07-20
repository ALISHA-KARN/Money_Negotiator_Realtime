import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

function JoinSession({ setUser }) {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  const fullQuote = "Crraft your offer. Make your move.";
  const [quote, setQuote] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullQuote.length) {
        setQuote((prev) => prev + fullQuote.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleJoin = () => {
    const newUser = { name, roomId };
    localStorage.setItem("negotiationUser", JSON.stringify(newUser));
    setUser(newUser);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/bg1.jpg')" }}
    >

      <motion.div
        className="text-xl md:text-2xl font-semibold text-white drop-shadow-lg text-center mb-8 max-w-xl min-h-[60px]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {quote}
      </motion.div>

      {/* Join Room box */}
      <div className="bg-black bg-opacity-70 p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Join Session</h1>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
        />
        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full mb-6 p-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
        >
          Join
        </button>
      </div>
    </div>
  );
}

export default JoinSession;
