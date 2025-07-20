import React, { useEffect, useState } from "react";
import JoinSession from "./components/JoinSession";
import NegotiationRoom from "./components/NegotiationRoom";

function App() {
  const [user, setUser] = useState({ name: "", roomId: "" });

  // Load user from localStorage on page load
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("negotiationUser"));
    if (savedUser?.name && savedUser?.roomId) {
      setUser(savedUser);
    }
  }, []);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {user.name && user.roomId ? (
        <NegotiationRoom user={user} setUser={setUser} />
      ) : (
        <JoinSession setUser={setUser} />
      )}
    </div>
  );
}

export default App;


