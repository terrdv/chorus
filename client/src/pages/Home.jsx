import { useState, useEffect } from "react";
import { fetchTrendingSongs } from "../services/songAPI";
import SongCard from "../components/SongCard";

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
      <h1>Trending Songs</h1>
      <div className="song-list">
        {trendingSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}

export default Home;

