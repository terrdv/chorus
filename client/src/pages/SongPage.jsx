import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSongById } from '../services/songAPI';

function SongPage() {
  const { songId } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSongDetails() {
      try {
        setLoading(true);
        const response = await getSongById(songId);
        if (response.success && response.song) {
          setSong(response.song);
        } else {
          setError('Song not found');
        }
      } catch (err) {
        console.error('Error fetching song details:', err);
        setError('Failed to load song details');
      } finally {
        setLoading(false);
      }
    }

    if (songId) {
      fetchSongDetails();
    }
  }, [songId]);

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="song-page">
        <div className="loading-container">
          <div className="retro-loading"></div>
          <p>Loading song details...</p>
        </div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="song-page">
        <div className="error-container">
          <h2>Song Not Found</h2>
          <p>{error || 'The requested song could not be found.'}</p>
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="song-page">
      <div className="song-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <h1 className="song-page-title">{song.name}</h1>
      </div>

      <div className="song-content">
        <div className="song-artwork">
          <img 
            src={song.cover_image_medium || song.cover_image_large} 
            alt={`${song.name} album cover`}
            className="song-cover"
          />
        </div>

        <div className="song-details">
          <div className="detail-section">
            <h3>Artist</h3>
            <p className="detail-value">{song.artist}</p>
          </div>

          <div className="detail-section">
            <h3>Album</h3>
            <p className="detail-value">{song.album}</p>
          </div>

          {song.duration_ms && (
            <div className="detail-section">
              <h3>Duration</h3>
              <p className="detail-value">{formatDuration(song.duration_ms)}</p>
            </div>
          )}

          {song.release_date && (
            <div className="detail-section">
              <h3>Release Date</h3>
              <p className="detail-value">{formatDate(song.release_date)}</p>
            </div>
          )}

          {song.popularity && (
            <div className="detail-section">
              <h3>Popularity</h3>
              <div className="popularity-bar">
                <div 
                  className="popularity-fill" 
                  style={{ width: `${song.popularity}%` }}
                ></div>
                <span className="popularity-text">{song.popularity}/100</span>
              </div>
            </div>
          )}

          {song.url && (
            <div className="detail-section">
              <h3>Listen on Spotify</h3>
              <a 
                href={song.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="spotify-link"
              >
                Open in Spotify →
              </a>
            </div>
          )}

          {song.preview_url && (
            <div className="detail-section">
              <h3>Preview</h3>
              <audio controls className="preview-audio">
                <source src={song.preview_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SongPage;
