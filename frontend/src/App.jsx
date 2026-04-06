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

  const handleDelete = async (id, isDeleted) => {
    if (isDeleted) return;

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

  const pinMsg = async (id, isDeleted) => {
    if (isDeleted) return;
    await axios.put(`${API}/pin/${id}`);
    fetchMessages();
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b141a] text-white">

      {/* HEADER */}
      <div className="bg-[#202c33] p-4 font-semibold text-lg flex justify-between">
        <span>💬 Chat App</span>
        <span className="text-sm text-gray-400">Online</span>
      </div>

      {/* PINNED */}
      <div className="bg-[#111b21] px-4 py-2 border-b border-gray-700">
        <p className="text-yellow-400 text-sm">📌 Pinned</p>

        {messages.filter(m => m.isPinned && !m.isDeleted).length === 0 && (
          <p className="text-xs text-gray-500">No pinned messages</p>
        )}

        {messages
          .filter(m => m.isPinned && !m.isDeleted)
          .map(m => (
            <div key={m._id} className="text-xs text-gray-300 truncate">
              {m.content}
            </div>
          ))}
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.length === 0 && (
          <p className="text-center text-gray-500">No messages yet 👀</p>
        )}

        {messages
          .filter(m => !deletedForMe.includes(m._id))
          .map((m, i) => (
            <div
              key={m._id}
              className={`max-w-xs p-3 rounded-lg relative shadow ${
                i % 2 === 0
                  ? "bg-[#202c33]"
                  : "bg-[#005c4b] ml-auto"
              }`}
            >
              {/* PIN BADGE */}
              {m.isPinned && !m.isDeleted && (
                <span className="text-yellow-400 text-xs">📌</span>
              )}

              <p className="text-sm">
                {m.isDeleted
                  ? "🚫 This message was deleted"
                  : m.content}
              </p>

              <div className="text-[10px] text-gray-300 mt-1 text-right">
                {new Date(m.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* ACTIONS */}
              <div className="absolute top-1 right-1 flex gap-1 text-xs opacity-70">
                <button onClick={() => handleDelete(m._id, m.isDeleted)}>🗑</button>
                <button onClick={() => pinMsg(m._id, m.isDeleted)}>
                  {m.isPinned ? "❌" : "📌"}
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* INPUT */}
      <div className="flex p-3 bg-[#202c33] gap-2 items-center">
        <input
          className="flex-1 p-2 rounded-full bg-[#2a3942] outline-none px-4"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
        />
        <button
          disabled={!text.trim()}
          onClick={sendMessage}
          className="bg-[#00a884] px-5 py-2 rounded-full font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;