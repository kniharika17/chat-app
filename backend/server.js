const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.log("Mongo Error:", err);
    process.exit(1); // optional but good
  });

  
const Message = mongoose.model("Message", {
  content: String,
  timestamp: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false }
});

// Routes
app.post("/api/messages", async (req, res) => {
  const msg = new Message({ content: req.body.content });
  await msg.save();
  res.json(msg);
});

app.get("/api/messages", async (req, res) => {
  const msgs = await Message.find();
  res.json(msgs);
});

app.delete("/api/messages/:id", async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ msg: "Deleted" });
});

app.put("/api/messages/pin/:id", async (req, res) => {
  const msg = await Message.findById(req.params.id);
  msg.isPinned = !msg.isPinned;
  await msg.save();
  res.json(msg);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));