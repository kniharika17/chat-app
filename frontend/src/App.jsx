import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/messages";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    const res = await axios.get(API);
    setMessages(res.data);
  };

  useEffect(() => {
    fetchMessages();
    setInterval(fetchMessages, 2000);
  }, []);

  const sendMessage = async () => {
    if (!text) return;
    await axios.post(API, { content: text });
    setText("");
  };

  return (
    <div>
      <h2>Chat App</h2>

      {messages.map((m) => (
        <div key={m._id}>
          <p>{m.isDeleted ? "Deleted" : m.content}</p>
          <button onClick={() => axios.delete(`${API}/${m._id}`)}>Delete</button>
          <button onClick={() => axios.put(`${API}/pin/${m._id}`)}>Pin</button>
        </div>
      ))}

      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;