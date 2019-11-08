const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  date: { type: Date, default: new Date(Date.now()) },
  name: {
      type: String,
      trim: true,
  },
  text: {
      type: String,
      trim: true,
  }
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
