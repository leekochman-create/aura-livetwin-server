import express from "express";
import { speakText, generateVideo } from "../utils/did.js";
import { supabase } from "../utils/supabase.js";

const router = express.Router();

router.post("/speak", async (req, res) => {
  const { twin_id, text } = req.body;

  const { data } = await supabase
    .from("twins")
    .select("avatar_id")
    .eq("id", twin_id)
    .single();

  const url = await speakText(data.avatar_id, text);

  res.json({ audio: url });
});

router.post("/video", async (req, res) => {
  const { twin_id, audio_url } = req.body;

  const { data } = await supabase
    .from("twins")
    .select("avatar_id")
    .eq("id", twin_id)
    .single();

  const video = await generateVideo(data.avatar_id, audio_url);

  res.json({ video });
});

export default router;
