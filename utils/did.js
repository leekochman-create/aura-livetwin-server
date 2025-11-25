import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const DID_API_KEY = process.env.DID_API_KEY;

export const createLiveAvatar = async (imageUrl) => {
  const res = await axios.post(
    "https://api.d-id.com/avatars",
    { source_url: imageUrl },
    { headers: { Authorization: `Basic ${DID_API_KEY}` } }
  );

  return res.data.avatar_id;
};

export const speakText = async (avatarId, text) => {
  const res = await axios.post(
    `https://api.d-id.com/avatars/${avatarId}/speak`,
    { text },
    { headers: { Authorization: `Basic ${DID_API_KEY}` } }
  );

  return res.data.result_url;
};

export const generateVideo = async (avatarId, audioUrl) => {
  const res = await axios.post(
    `https://api.d-id.com/avatars/${avatarId}/video`,
    { audio_url: audioUrl },
    { headers: { Authorization: `Basic ${DID_API_KEY}` } }
  );

  return res.data.result_url;
};
