function SongCard({ song }) {
  return (
    <div className="song-card">
      <a href={`/song/${song.id}`}>
        <img src={song.cover_image_medium} alt={song.name} />
        <h3 className="song-title">{song.name}</h3>
      </a>
      
      <p className="song-artist">{song.artist}</p>
    </div>
  );
}

export default SongCard