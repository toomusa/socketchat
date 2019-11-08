const socket   = io();
const status   = document.getElementById('status');
const messages = document.getElementById('messages');
const textarea = document.getElementById('textarea');
const username = document.getElementById('username');
const clearBtn = document.getElementById('clear');
const sendBtn  = document.getElementById('send');

// Sends request for all messages in db when a user is connected
socket.emit("LoadMessages", data => {
  if (data) {
    data.forEach(message => {
      let newMessage = document.createElement("div")
      newMessage.setAttribute("class", "chat-message")
      newMessage.textContent = message.name + ": " + message.text
      messages.appendChild(newMessage)
    });
  } 
})

// Sends message when user clicks enter
textarea.addEventListener("keydown", function(e){
  if(e.which === 13 && e.shiftKey == false){
    socket.emit("SendMessage", {
      name: username.value,
      text: textarea.value
    });
    e.preventDefault();
  }
})

// Sends message when user clicks send
sendBtn.addEventListener("click", function(e){
  socket.emit("SendMessage", {
    name: username.value,
    text: textarea.value
  });
  e.preventDefault();
});

// Renders new message when message is received from the server
socket.on("MessageReceived", savedMessage => {
  textarea.value = '';
  let { name, text } = savedMessage
  if (savedMessage) {
    let newMessage = document.createElement("div")
    newMessage.setAttribute("class", "chat-message")
    newMessage.textContent = name + ": " + text
    messages.appendChild(newMessage)
  } else {
    console.log("No message received")
  }
})

// Sends request to server to delete all messages from db
clearBtn.addEventListener("click", () => {
  socket.emit('ClearMessages');
});

// Clears all messages from chat area once they're removed from db
socket.on("Cleared", () => {
  messages.textContent = '';
});

// Sets a temporary status alert above the chat window to handle errors
socket.on("Status", alert => {
  status.textContent = alert
  setTimeout(() => {
    status.textContent = ""
  }, 3000)
})


