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

  const handleDelete = async (id) => {
    const choice = window.prompt(
      "1 → Delete for Me\n2 → Delete for Everyone"
    );

    if (choice === "1") {
      const updated = [...deletedForMe, id];
      setDeletedForMe(updated);
      localStorage.setItem("deletedForMe", JSON.stringify(updated));
    } else if (choice === "2") {
      await axios.delete(`${API}/${id}`);
      fetchMessages();
    }
  };

  const pinMsg = async (id) => {
    await axios.put(`${API}/pin/${id}`);
    fetchMessages();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>💬 Chat App</h2>

      {/* Pinned Messages */}
      <div style={styles.pinned}>
        <h4>📌 Pinned</h4>
        {messages
          .filter((m) => m.isPinned)
          .map((m) => (
            <div key={m._id} style={styles.pinnedMsg}>
              {m.content}
            </div>
          ))}
      </div>

      {/* Chat Area */}
      <div style={styles.chatBox}>
        {messages
          .filter((m) => !deletedForMe.includes(m._id))
          .map((m, i) => (
            <div
              key={m._id}
              style={{
                ...styles.message,
                alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
                background: m.isPinned ? "#ffeaa7" : "#74b9ff",
              }}
            >
              <p>{m.isDeleted ? "🚫 Deleted" : m.content}</p>
              <small>
                {new Date(m.timestamp).toLocaleTimeString()}
              </small>

              <div style={styles.actions}>
                <button onClick={() => handleDelete(m._id)}>🗑</button>
                <button onClick={() => pinMsg(m._id)}>
                  {m.isPinned ? "❌" : "📌"}
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Input */}
      <div style={styles.inputBox}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendBtn}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0f172a",
    color: "white",
    padding: "10px",
  },
  header: {
    textAlign: "center",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px",
  },
  message: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "70%",
  },
  actions: {
    display: "flex",
    gap: "5px",
    marginTop: "5px",
  },
  inputBox: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "none",
  },
  sendBtn: {
    padding: "10px",
    background: "#10b981",
    border: "none",
    color: "white",
    borderRadius: "5px",
  },
  pinned: {
    background: "#1e293b",
    padding: "10px",
    borderRadius: "8px",
  },
  pinnedMsg: {
    fontSize: "12px",
    color: "#facc15",
  },
};

export default App;