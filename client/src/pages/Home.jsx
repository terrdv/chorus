import { useState, useEffect } from "react";
import { fetchTrendingSongs } from "../services/songAPI";
import SongCard from "../components/SongCard";
import Search from "../components/Search";

function Home() {
  const [trendingSongs, setTrendingSongs] = useState([]);

  useEffect(() => {
    async function getTrendingSongs() {
      try {
        const songs = await fetchTrendingSongs();
        setTrendingSongs(songs.songs);
      } catch (error) {
        console.error("Error fetching trending songs:", error);
      }
    }

    getTrendingSongs();
  }, []);

  return (
    <div className="home-page">
      {/* Search Bar */}
      <Search />

      {/* Trending Songs */}
      <div className="trending-section">
        <h2 className="retro-title">Trending Songs</h2>
        <div className="horizontal-song-list">
          {trendingSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

