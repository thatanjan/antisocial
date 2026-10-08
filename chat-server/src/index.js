import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/chat";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN || "*" },
});

app.get("/health", (_req, res) => res.json({ ok: true }));

io.on("connection", (socket) => {
  console.log(`client connected: ${socket.id}`);

  socket.on("message", (payload) => {
    io.emit("message", { ...payload, sender: socket.id });
  });

  socket.on("disconnect", () => {
    console.log(`client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`chat-server listening on :${PORT}`);
});

mongoose
  .connect(MONGO_URL, { serverSelectionTimeoutMS: 3000 })
  .then(() => console.log(`mongo connected: ${MONGO_URL}`))
  .catch((err) =>
    console.error("mongo connect failed (server still running):", err.message)
  );
