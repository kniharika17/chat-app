const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("Mongo Error:", err);
    process.exit(1);
  });

const Message = mongoose.model("Message", {
  content: String,
  timestamp: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false }
});


// ✅ CREATE MESSAGE (VALIDATION ADDED)
app.post("/api/messages", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const msg = new Message({ content });
    await msg.save();

    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ GET MESSAGES
app.get("/api/messages", async (req, res) => {
  try {
    const msgs = await Message.find().sort({ timestamp: 1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ DELETE (FIXED EDGE CASE)
app.delete("/api/messages/:id", async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      isPinned: false   // 🔥 important fix
    });

    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ PIN TOGGLE
app.put("/api/messages/pin/:id", async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);

    if (!msg || msg.isDeleted) {
      return res.status(400).json({ error: "Invalid message" });
    }

    msg.isPinned = !msg.isPinned;
    await msg.save();

    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));