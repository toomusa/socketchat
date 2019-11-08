const Chat = require("./model")

const db = {
  saveMessage: async (message, cb) => {
    let savedMessage = await Chat.create(message)
    cb(savedMessage)
  },
  loadMessages: async (cb) => {
    let savedMessages = await Chat.find().limit(100).sort({ _id: 1 })
    cb(savedMessages)
  },
  deleteMessages: async (cb) => {
    let deleted = await Chat.deleteMany()
    cb(deleted)
  }
}

module.exports = db;