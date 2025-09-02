function SongCard({ song }) {
  return (
    <div className="song-card">
      <img src={song.cover_image_medium} alt={song.name} />
      <h3>{song.name}</h3>
      <p>{song.artist}</p>
    </div>
  );
}

export default SongCard