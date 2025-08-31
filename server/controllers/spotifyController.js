const { getTrendingSongs, testSpotifyConnection } = require("../services/spotifyTrending");

async function fetchTrending(req, res) {
  try {
    console.log("Fetching trending songs from Spotify...");
    const songs = await getTrendingSongs();
    
    console.log(`Successfully fetched ${songs.length} trending songs`);
    res.json({
      success: true,
      count: songs.length,
      songs: songs,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error fetching trending songs:", err.message);
    
    // Provide more helpful error messages
    let statusCode = 500;
    let errorMessage = err.message;
    
    if (err.message.includes("credentials not found")) {
      statusCode = 400;
      errorMessage = "Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.";
    } else if (err.message.includes("401")) {
      statusCode = 401;
      errorMessage = "Invalid Spotify credentials. Please check your CLIENT_ID and CLIENT_SECRET.";
    } else if (err.message.includes("429")) {
      statusCode = 429;
      errorMessage = "Spotify API rate limit exceeded. Please try again later.";
    }
    
    res.status(statusCode).json({ 
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
}

async function testConnection(req, res) {
  try {
    console.log("Testing Spotify connection...");
    const result = await testSpotifyConnection();
    res.json({
      success: true,
      message: "Spotify connection successful",
      details: result,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Spotify connection test failed:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = { fetchTrending, testConnection };