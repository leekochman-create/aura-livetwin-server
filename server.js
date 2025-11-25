import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

import { initSignaling } from "./webrtc/signaling.js";

import twinRoutes from "./routes/twin.js";
import realtimeRoutes from "./routes/realtime.js";
import trainingRoutes from "./routes/training.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/twin", twinRoutes);
app.use("/realtime", realtimeRoutes);
app.use("/training", trainingRoutes);

const server = http.createServer(app);
initSignaling(server);

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => console.log(`🔥 AURA LIVE SERVER running on ${PORT}`));
