require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const DAILY_API = "https://api.daily.co/v1";
const API_KEY = process.env.DAILY_API_KEY;

// Middleware to add API Key to requests
const dailyHeaders = {
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
};

// **API to create a new video room**
app.post("/create-room", async (req, res) => {
  try {
    const { name, privacy } = req.body;

    const response = await axios.post(
      `${DAILY_API}/rooms`,
      { name, privacy: privacy || "public" }, // public or private
      dailyHeaders
    );

    return res.json({ success: true, url: response.data.url });
  } catch (error) {
    console.error("Error creating room:", error.response.data);
    return res
      .status(500)
      .json({ success: false, message: error.response.data });
  }
});

// **API to start a live video stream**
app.post("/start-live-video", async (req, res) => {
  try {
    const { streamName, isPrivate } = req.body;

    // Create a new Daily.co room for live video
    const response = await axios.post(
      `${DAILY_API}/rooms`,
      {
        name: streamName || `live-stream-${Date.now()}`,
        privacy: isPrivate ? "private" : "public",
        properties: {
          exp: Math.floor(Date.now() / 1000) + 3600, // Room expires in 1 hour
        },
      },
      dailyHeaders
    );

    return res.json({ success: true, url: response.data.url });
  } catch (error) {
    console.error("Error starting live video:", error.response.data);
    return res
      .status(500)
      .json({ success: false, message: error.response.data });
  }
});

// **API to list all video rooms**
app.get("/list-rooms", async (req, res) => {
  try {
    const response = await axios.get(`${DAILY_API}/rooms`, dailyHeaders);
    return res.json({ success: true, rooms: response.data });
  } catch (error) {
    console.error("Error fetching rooms:", error.response.data);
    return res
      .status(500)
      .json({ success: false, message: error.response.data });
  }
});

// **API to delete a room**
app.delete("/delete-room/:roomName", async (req, res) => {
  try {
    const response = await axios.delete(
      `${DAILY_API}/rooms/${req.params.roomName}`,
      dailyHeaders
    );
    return res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error.response.data);
    return res
      .status(500)
      .json({ success: false, message: error.response.data });
  }
});

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));
