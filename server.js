"use strict";
const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const fileupload = require("express-fileupload");
app.use(fileupload());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json())
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(express.static(__dirname + "./public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const axios = require("axios");
const userRouter = require("./Routes/messageRouter");
app.use("/route", userRouter);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /****** sendTyping ****** */
  socket.on("sendTyping", (data) => {
    console.log("typing data :");
    io.to(data.room).emit("typing", {
      name: data.name,
      room: data.room,
      data: data,
    });
  });

  socket.on("newchat", async (data) => {
    console.log("Received newchat data from client:", data);
    try {
      const msg = {
        ...data.msg,
        chatId: data.msg.chatId,
      };
      io.to(data.msg.chatId).emit("message", msg);
      console.log("Response from server:");
      // }
    } catch (error) {
      console.error("Error in newchat:", error);
    }
  });

  const fs = require("fs").promises;
  const path = require("path");

  socket.on("joinRoom", async (room) => {
    console.log("room====>>>>", room);
    socket.join(room);
    console.log("roomjoin-", room);
    updateNumberOfPeopleInRoom(room);
  });

  socket.on("leaveRoom", async (room) => {
    console.log("room====>>>>", room);
    socket.leave(room);
    console.log("roomleave-", room);
    updateNumberOfPeopleInRoom(room);
  });

  function updateNumberOfPeopleInRoom(room) {
    console.log("room==", room);
    const roomMembers = io.sockets.adapter.rooms.get(room);
    console.log("roomMembers-------", roomMembers);
    const numberOfPeopleInRoom = roomMembers ? roomMembers.size : 0;
    console.log(`Number of people in room ${room}: ${numberOfPeopleInRoom}`);
    // Emit the updated number of people to all clients in the room
    io.to(room).emit("numberOfPeopleInRoom", { numberOfPeopleInRoom });
    console.log("Updated number of people in room sent to clients");
  }

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  socket.on("notifyRecipient", (data) => {
    io.to(data.recipientRoom).emit("notifyRecipient", {
      sender: data.sender,
      message: data.message,
    });
  });
});
