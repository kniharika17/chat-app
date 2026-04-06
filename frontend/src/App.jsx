import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://chat-backend-muc1.onrender.com/api/messages";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [deletedForMe, setDeletedForMe] = useState(
    JSON.parse(localStorage.getItem("deletedForMe")) || []
  );

  const fetchMessages = async () => {
    const res = await axios.get(API);
    setMessages(res.data);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await axios.post(API, { content: text });
    setText("");
    fetchMessages();
  };

  // 🔥 NEW DELETE HANDLER
  const handleDelete = async (id) => {
    const choice = window.prompt(
      "Type:\n1 → Delete for Me\n2 → Delete for Everyone"
    );

    if (choice === "1") {
      const updated = [...deletedForMe, id];
      setDeletedForMe(updated);
      localStorage.setItem("deletedForMe", JSON.stringify(updated));
    } 
    else if (choice === "2") {
      await axios.delete(`${API}/${id}`);
      fetchMessages();
    }
  };

  const pinMsg = async (id) => {
    await axios.put(`${API}/pin/${id}`);
    fetchMessages();
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>💬 Chat App</h2>

      {messages
        .filter((m) => !deletedForMe.includes(m._id))
        .map((m) => (
          <div
            key={m._id}
            style={{
              border: "1px solid gray",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: m.isPinned ? "lightyellow" : "white",
            }}
          >
            <p>{m.isDeleted ? "🚫 Deleted" : m.content}</p>

            <small>
              {new Date(m.timestamp).toLocaleTimeString()}
            </small>

            <div style={{ marginTop: 5 }}>
              <button onClick={() => handleDelete(m._id)}>
                Delete
              </button>

              <button onClick={() => pinMsg(m._id)}>
                {m.isPinned ? "Unpin" : "Pin"}
              </button>
            </div>
          </div>
        ))}

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;