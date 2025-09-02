
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

async function getTrendingSongs() {
  try {
    const token = await getAccessToken();
    console.log("Fetching trending songs from Spotify...");

    // Try to get more songs by using a broader search and higher limit
    const resp = await fetch(
      `https://api.spotify.com/v1/search?q=year:2025&type=track&market=US&limit=50&offset=0&sort=popularity`,
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Failed to fetch from Spotify: ${resp.status} - ${errorText}`);
    }

    const data = await resp.json();

    // If we got less than 50, try to get more with offset
    let allTracks = [...data.tracks.items];
    
    if (data.tracks.total > 50 && data.tracks.items.length < 50) {
      console.log("Trying to get more tracks with offset...");
      
      // Get next batch
      const resp2 = await fetch(
        `https://api.spotify.com/v1/search?q=year:2025&type=track&market=US&limit=50&offset=50&sort=popularity`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (resp2.ok) {
        const data2 = await resp2.json();
        console.log(`Retrieved additional ${data2.tracks.items.length} tracks`);
        allTracks = allTracks.concat(data2.tracks.items);
      }
    }

    // Also try a broader search without year restriction to get more variety
    // if (allTracks.length < 50) {
    //   console.log("Trying broader search for more tracks...");
      
    //   const broadResp = await fetch(
    //     `https://api.spotify.com/v1/search?q=*&type=track&market=US&limit=50&sort=popularity`,
    //     { 
    //       headers: { 
    //         Authorization: `Bearer ${token}`,
    //         'Content-Type': 'application/json'
    //       } 
    //     }
    //   );

    //   if (broadResp.ok) {
    //     const broadData = await broadResp.json();
    //     console.log(`Retrieved ${broadData.tracks.items.length} tracks from broad search`);
        
    //     // Add unique tracks from broad search
    //     const existingIds = new Set(allTracks.map(t => t.id));
    //     const newTracks = broadData.tracks.items.filter(track => !existingIds.has(track.id));
    //     allTracks = allTracks.concat(newTracks);
    //   }
    // }

    // console.log(`Final total tracks: ${allTracks.length}`);

    // Sort by popularity and take top 50
    const sortedTracks = allTracks
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 50);

    console.log(`Returning top ${sortedTracks.length} tracks by popularity`);

    return sortedTracks.map((track, index) => ({
      rank: index + 1,
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
    console.error("Error in getTrendingSongs:", error);
    throw error;
  }
}

async function testSpotifyConnection() {
  try {
    const token = await getAccessToken();
    
    // Test with a simple API call
    const resp = await fetch(
      "https://api.spotify.com/v1/browse/new-releases?country=US&limit=1",
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );

    if (!resp.ok) {
      throw new Error(`Spotify API test failed: ${resp.status}`);
    }

    return {
      status: "connected",
      message: "Successfully connected to Spotify API"
    };
  } catch (error) {
    throw new Error(`Spotify connection test failed: ${error.message}`);
  }
}

module.exports = { getTrendingSongs, testSpotifyConnection };