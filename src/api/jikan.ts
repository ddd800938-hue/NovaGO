import type { Anime } from '../types/anime';

const BASE = 'https://api.jikan.moe/v4';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url);
    if (res.status === 429) {
      await delay(1200 * (i + 1));
      continue;
    }
    return res;
  }
  throw new Error('Too many requests');
}

export async function getTopAnime(page = 1, limit = 24): Promise<Anime[]> {
  const res = await fetchWithRetry(`${BASE}/top/anime?page=${page}&limit=${limit}&type=tv`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}

export async function getSeasonalAnime(limit = 24): Promise<Anime[]> {
  const res = await fetchWithRetry(`${BASE}/seasons/now?limit=${limit}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}

export async function searchAnime(query: string, page = 1): Promise<{ results: Anime[]; total: number }> {
  if (!query.trim()) return { results: [], total: 0 };
  const res = await fetchWithRetry(`${BASE}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20&sfw=true`);
  if (!res.ok) return { results: [], total: 0 };
  const data = await res.json();
  return {
    results: data.data ?? [],
    total: data.pagination?.items?.total ?? 0,
  };
}

export async function getAnimeById(id: number): Promise<Anime | null> {
  const res = await fetchWithRetry(`${BASE}/anime/${id}/full`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.data ?? null;
}

export async function getAnimeByGenre(genreId: number, page = 1): Promise<Anime[]> {
  const res = await fetchWithRetry(`${BASE}/anime?genres=${genreId}&page=${page}&limit=20&order_by=score&sort=desc`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}

export async function getUpcomingAnime(limit = 12): Promise<Anime[]> {
  const res = await fetchWithRetry(`${BASE}/seasons/upcoming?limit=${limit}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}
