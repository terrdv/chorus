const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function fetchTrendingSongs() {
  const response = await fetch(`${BASE_URL}spotify/trending`);
  if (!response.ok) throw new Error('Fetching trending songs failed');
  return await response.json();
}