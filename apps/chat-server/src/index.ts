import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { authenticateSocket, requireAuth } from "./auth.js";

const PORT = parseInt(process.env.PORT || "4000", 10);
const MONGO_URL = process.env.MONGO_URL || "";

interface MessagePayload {
  text: string;
}

const app = express();
const server = app.listen(PORT, () => {
  console.log(`chat-server listening on :${PORT}`);
});

const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN || "*", credentials: true },
});

app.get("/health", (_req: express.Request, res: express.Response) =>
  res.json({ ok: true }),
);
app.use(requireAuth);

io.use(authenticateSocket);

io.on("connection", (socket) => {
  console.log(`client connected: ${socket.id}`);

  socket.on("message", (payload: MessagePayload) => {
    io.emit("message", {
      ...payload,
      sender: socket.data.session.user.id,
    });
  });

  socket.on("disconnect", () => {
    console.log(`client disconnected: ${socket.id}`);
  });
});

mongoose
  .connect(MONGO_URL, { serverSelectionTimeoutMS: 3000 })
  .then(() => console.log(`mongo connected: ${MONGO_URL}`))
  .catch((err: unknown) =>
    console.error(
      "mongo connect failed (server still running):",
      err instanceof Error ? err.message : String(err),
    ),
  );
