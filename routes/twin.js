import express from "express";
import { supabase } from "../utils/supabase.js";
import { createLiveAvatar } from "../utils/did.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { name, bio, image_url } = req.body;

    const avatar_id = await createLiveAvatar(image_url);

    const { data, error } = await supabase
      .from("twins")
      .insert({
        name,
        bio,
        avatar_id,
        image_url
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json({ twin: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  const { data } = await supabase
    .from("twins")
    .select("*")
    .eq("id", req.params.id)
    .single();

  res.json(data);
});

export default router;
