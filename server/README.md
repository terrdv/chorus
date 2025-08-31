# Spotify Trending Songs Server

This server fetches the most popular songs from Spotify using a simple popularity-based search.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the server directory with:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   PORT=3000
   ```

3. **Get Spotify credentials:**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Copy the Client ID and Client Secret

## Running the server

- **Development mode:** `npm run dev`
- **Production mode:** `npm start`

## API Endpoints

- `GET /` - Root endpoint
- `GET /health` - Server health check
- `GET /spotify/test` - Test endpoint
- `GET /spotify/test-connection` - Test Spotify API connection
- `GET /spotify/trending` - Get most popular songs from Spotify

## Response Format

The trending endpoint returns:
```json
{
  "success": true,
  "count": 50,
  "songs": [
    {
      "rank": 1,
      "name": "Song Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "url": "Spotify URL",
      "duration_ms": 180000,
      "popularity": 95,
      "preview_url": "Preview URL",
      "release_date": "2024-01-01",
      "genres": []
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Features

- **Popularity-based search**: Gets the most popular songs overall from Spotify
- **Simple and fast**: Single API call for maximum efficiency
- **Comprehensive results**: Includes all genres and styles of popular music
- **Robust error handling**: Provides helpful error messages for common issues
- **Connection testing**: Test endpoint to verify Spotify credentials work

## Troubleshooting

- **401 Error**: Check your Spotify credentials
- **429 Error**: Rate limit exceeded, wait and try again
- **400 Error**: Missing environment variables
- **500 Error**: General server error, check logs

