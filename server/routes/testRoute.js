const express = require("express");
const { fetchTrending, testConnection, searchSongs, autoComplete, getSong } = require("../controllers/spotifyController");

const router = express.Router();

// Test Spotify connection
router.get("/test-connection", testConnection);

// Get trending songs from Spotify
router.get("/trending", fetchTrending);

// Test endpoint to verify the route is working
router.get("/test", (req, res) => {
  res.json({ message: "Spotify routes are working!" });
});

// Search songs from Spotify
router.get("/search", searchSongs);

// Auto-complete search
router.get("/autocomplete", autoComplete);

// Get single song by ID
router.get("/song/:songId", getSong);

module.exports = router;