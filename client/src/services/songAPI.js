const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function fetchTrendingSongs() {
  const response = await fetch(`${BASE_URL}spotify/trending`);
  if (!response.ok) throw new Error('Fetching trending songs failed');
  return await response.json();
}

export async function searchSongs(query) {
  const response = await fetch(`${BASE_URL}spotify/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Searching songs failed');
  return await response.json();
}

export async function getAutoComplete(query) {
  const response = await fetch(`${BASE_URL}spotify/autocomplete?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Auto-complete search failed');
  return await response.json();
}

export async function getSongById(songId) {
  const response = await fetch(`${BASE_URL}spotify/song/${songId}`);
  if (!response.ok) throw new Error('Failed to fetch song details');
  return await response.json();
}