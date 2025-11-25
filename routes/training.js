import express from "express";
const router = express.Router();

router.post("/memory", async (req, res) => {
  res.json({ ok: true, message: "Memory updated (placeholder)" });
});

export default router;
