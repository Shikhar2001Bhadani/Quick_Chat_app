import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// ✅ Support Multiple Frontend URLs for WebSocket
const allowedOrigins = process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(",") : [];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ✅ Store Active User Connections
const userSocketMap = {};

// ✅ Function to Get User's Socket ID
const getSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  console.log(`🔗 New client connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("onlineUsers", Object.keys(userSocketMap)); // Send online users list
  }

  // ✅ Handle Sending Messages
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = getSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageReceived", { senderId, message });
    }
  });

  // ✅ Handle Disconnects
  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);

    if (userId) {
      delete userSocketMap[userId];
      io.emit("onlineUsers", Object.keys(userSocketMap)); // Update online users list
    }
  });
});

export { io, app, server, getSocketId };
