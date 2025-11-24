// =============================
// AURA LiveTwin WebRTC SERVER
// =============================

import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import cors from "cors";

// -----------------------------
// BASIC SERVER
// -----------------------------
const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

// -----------------------------
// WEBSOCKET SIGNALING SERVER
// -----------------------------
const wss = new WebSocketServer({ server: httpServer });

let clients = {}; // twin_id → ws connection
let sessions = {}; // twin_id → session info

wss.on("connection", (ws, req) => {
  const twinId = new URL(req.url, "http://localhost").searchParams.get("id");

  if (!twinId) {
    ws.close();
    return;
  }

  // שמירת החיבור
  clients[twinId] = ws;
  console.log(`🔵 Twin connected: ${twinId}`);

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());

    // Offer (מהשרת → לדפדפן)
    if (data.type === "offer") {
      if (clients[twinId]) {
        clients[twinId].send(JSON.stringify({ type: "offer", offer: data.offer }));
      }
    }

    // Answer (מהדפדפן → לשרת)
    if (data.type === "answer") {
      if (sessions[twinId]) {
        sessions[twinId].send(JSON.stringify({ type: "answer", answer: data.answer }));
      }
    }

    // Chat relay
    if (data.type === "chat") {
      if (clients[twinId]) {
        clients[twinId].send(JSON.stringify({ type: "chat", text: data.text }));
      }
    }
  });

  ws.on("close", () => {
    console.log(`🔴 Twin disconnected: ${twinId}`);
    delete clients[twinId];
  });
});

// -----------------------------
// HEALTHTEST
// -----------------------------
app.get("/", (req, res) => {
  res.send("AURA LiveTwin Server Running");
});

// -----------------------------
// RUN SERVER
// -----------------------------
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 AURA LiveTwin Server running on port ${PORT}`);
});
