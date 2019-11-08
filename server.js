const express  = require("express");
const app      = express();
const http     = require('http').createServer(app);
const io       = require('socket.io')(http);
const mongoose = require("mongoose");
const routes   = require("./routes");
const db       = require("./db");
const PORT     = process.env.PORT || 7777;

// Database setup
mongoose.connect("mongodb://localhost:socket/socketchat", 
  {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, () => {
    console.log("DB connected")
  })

// Middlewares setup
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json());
app.use(routes)

// Socket setup
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on("LoadMessages", (cb) => {
    socket.emit("Status", "Loading Messages")
    db.loadMessages( (allMessages) => {
      cb(allMessages)
    })
  })

  socket.on("SendMessage", (message) => {
    let { name, text } = message
    if (name == "" || text == "") {
      socket.emit("Status", "Please enter a name and message")
    } else {
      db.saveMessage(message, (savedMessage) => {
        socket.emit("MessageReceived", savedMessage)
        socket.emit("Status", "Message Sent")
      })
    }
  })

  socket.on("ClearMessages", () => {
    db.deleteMessages( (cb) => {
      socket.emit("Cleared")
      if (cb.deletedCount) {
        socket.emit("Status", `${cb.deletedCount} messages deleted`)
      }
    })
  })

});


http.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))