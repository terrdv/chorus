const { getTrendingSongs, testSpotifyConnection } = require("../services/spotifyTrending");
const { searchAutoComplete, getSongById } = require("../services/spotifySearch");

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

async function searchSongs(req, res) {
  try {
    const {query} = req.query;
    const songs = await searchAutoComplete(query);
    res.json({
      success: true,
      count: songs.length,
      songs: songs,
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    console.error("Error searching songs:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function autoComplete(req, res) {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        count: 0,
        query: q,
        suggestions: [],
        timestamp: new Date().toISOString()
      });
    }

    console.log(`Auto-complete search for: "${q}"`);
    const suggestions = await searchAutoComplete(q, 8);
    
    console.log(`Found ${suggestions.length} suggestions for "${q}"`);
    res.json({
      success: true,
      count: suggestions.length,
      query: q,
      suggestions: suggestions,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error in auto-complete:", err.message);
    
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

async function getSong(req, res) {
  try {
    const { songId } = req.params;
    
    if (!songId) {
      return res.status(400).json({
        success: false,
        error: "Song ID is required",
        timestamp: new Date().toISOString()
      });
    }

    console.log(`Fetching song with ID: "${songId}"`);
    const song = await getSongById(songId);
    
    res.json({
      success: true,
      song: song,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error fetching song:", err.message);
    
    let statusCode = 500;
    let errorMessage = err.message;
    
    if (err.message.includes("credentials not found")) {
      statusCode = 400;
      errorMessage = "Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.";
    } else if (err.message.includes("401")) {
      statusCode = 401;
      errorMessage = "Invalid Spotify credentials. Please check your CLIENT_ID and CLIENT_SECRET.";
    } else if (err.message.includes("404")) {
      statusCode = 404;
      errorMessage = "Song not found.";
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

module.exports = { fetchTrending, testConnection, searchSongs, autoComplete, getSong };