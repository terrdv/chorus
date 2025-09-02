const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials not found. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.");
  }

  console.log("Getting Spotify access token...");
  
  const resp = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Failed to get Spotify token: ${resp.status} - ${errorText}`);
  }

  const data = await resp.json();
  console.log("Successfully obtained Spotify access token");
  return data.access_token;
}

async function searchAutoComplete(query, limit = 10) {
  try {
    const token = await getAccessToken();
    console.log(`Auto-complete search for: "${query}"`);

    const resp = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&market=US&limit=${limit}`,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Failed to search Spotify: ${resp.status} - ${errorText}`);
    }

    const data = await resp.json();

    return data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map((a) => a.name).join(", "),
        album: track.album.name,
        url: track.external_urls.spotify,
        cover_image_medium: track.album.images?.[1]?.url || null,
    }));
  } catch (error) {
    console.error("Error in searchAutoComplete:", error);
    throw error;
  }
}

async function searchSongs(query, limit = 20) {
  try {
    const token = await getAccessToken();
    console.log(`Searching Spotify for: "${query}"`);

    const resp = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&market=US&limit=${limit}`,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Failed to search Spotify: ${resp.status} - ${errorText}`);
    }

    const data = await resp.json();
    console.log(`Found ${data.tracks.items.length} tracks for "${query}"`);

    return data.tracks.items.map((track) => ({
      // Spotify IDs - very useful for components!
      id: track.id,                    // Unique track ID
      track_id: track.id,              // Alternative name for clarity
      artist_ids: track.artists.map(a => a.id),  // Array of artist IDs
      album_id: track.album.id,        // Album ID
      // Track details
      name: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      url: track.external_urls.spotify,
      duration_ms: track.duration_ms,
      popularity: track.popularity,
      preview_url: track.preview_url,
      release_date: track.album.release_date,
      genres: track.album.genres || [],
      // Add cover images
      cover_image_large: track.album.images?.[0]?.url || null,
      cover_image_medium: track.album.images?.[1]?.url || null,
      cover_image_small: track.album.images?.[2]?.url || null
    }));
  } catch (error) {
    console.error("Error in searchSongs:", error);
    throw error;
  }
}

async function getSongById(trackId) {
  try {
    const token = await getAccessToken();
    console.log(`Fetching song by ID: "${trackId}"`);

    const resp = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Failed to fetch song: ${resp.status} - ${errorText}`);
    }

    const track = await resp.json();
    console.log(`Found song: "${track.name}" by ${track.artists[0].name}`);

    return {
      // Spotify IDs
      id: track.id,
      track_id: track.id,
      artist_ids: track.artists.map(a => a.id),
      album_id: track.album.id,
      // Track details
      name: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      url: track.external_urls.spotify,
      duration_ms: track.duration_ms,
      popularity: track.popularity,
      preview_url: track.preview_url,
      release_date: track.album.release_date,
      genres: track.album.genres || [],
      // Add cover images
      cover_image_large: track.album.images?.[0]?.url || null,
      cover_image_medium: track.album.images?.[1]?.url || null,
      cover_image_small: track.album.images?.[2]?.url || null
    };
  } catch (error) {
    console.error("Error in getSongById:", error);
    throw error;
  }
}

module.exports = { searchSongs, searchAutoComplete, getSongById };
