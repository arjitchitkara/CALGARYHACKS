const express = require("express");
const session = require("express-session");
const { google } = require("googleapis");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const credentials = require("./creds.json");
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const secretKey = crypto.randomBytes(32).toString("hex");
const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(session({ secret: secretKey, resave: false, saveUninitialized: true }));

let userProfileData;

// Function to get user profile from Google
async function getUserProfile(auth) {
  const service = google.people({ version: "v1", auth });
  const profile = await service.people.get({
    resourceName: "people/me",
    personFields: "names,photos,emailAddresses",
  });

  return {
    displayName: profile.data.names[0].displayName,
    profilePhotoUrl: profile.data.photos[0].url,
    userID: profile.data.resourceName.replace("people/", ""),
  };
}

// Google OAuth Login
app.get("/auth/google", (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.json({ authUrl });
});

// OAuth Callback
app.get("/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    req.session.tokens = tokens;

    userProfileData = await getUserProfile(oAuth2Client);
    console.log("User Profile:", userProfileData);

    res.redirect("http://localhost:3000/dashboard");
  } catch (error) {
    console.error("OAuth Error:", error);
    res.redirect("/error");
  }
});

// Fetch Google Fit Data
app.get("/fetch-data", async (req, res) => {
  if (!userProfileData) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const fitness = google.fitness({ version: "v1", auth: oAuth2Client });

    const startTimeMillis = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago
    const endTimeMillis = Date.now();

    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [
          { dataTypeName: "com.google.step_count.delta" },
          { dataTypeName: "com.google.heart_rate.bpm" },
          { dataTypeName: "com.google.sleep.segment" },
        ],
        bucketByTime: { durationMillis: 86400000 }, // Daily buckets
        startTimeMillis,
        endTimeMillis,
      },
    });

    console.log("Fitness Data:", JSON.stringify(response.data, null, 2));

    res.json({ userProfileData, fitnessData: response.data.bucket });
  } catch (error) {
    console.error("Error fetching fitness data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Start Server
app.listen(8000, () => console.log("Server running on port 8000"));
