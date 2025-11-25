import WebSocket from "ws";

const clients = new Map();

export function initSignaling(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    ws.on("message", (msg) => {
      const data = JSON.parse(msg);

      if (data.type === "join") {
        clients.set(data.room, ws);
        return;
      }

      if (clients.has(data.room)) {
        clients.get(data.room).send(JSON.stringify(data));
      }
    });

    ws.on("close", () => {
      for (const [room, client] of clients.entries()) {
        if (client === ws) clients.delete(room);
      }
    });
  });

  console.log("🔵 WebRTC signaling ready");
}
