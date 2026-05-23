import type { Anime } from '../types/anime';
import { apiCache } from '../utils/apiCache';

const BASE = 'https://shikimori.one/api';

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  let lastError: Error | null = null;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'NovaGO-AnimePlayer/1.0'
        }
      });
      if (res.status === 429) {
        await delay(1200 * (i + 1));
        continue;
      }
      return res;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i < retries - 1) {
        await delay(1000 * (i + 1));
      }
    }
  }
  if (lastError) throw lastError;
  throw new Error('Too many requests');
}

// Transform Shikimori anime to our Anime type
function transformShikimoriAnime(data: any): Anime {
  return {
    mal_id: data.id,
    title: data.name || data.russian || '',
    title_english: data.english?.[0] || data.name,
    title_japanese: data.japanese?.[0],
    synopsis: data.description,
    images: {
      jpg: {
        image_url: data.image?.original || '',
        small_image_url: data.image?.preview || '',
        large_image_url: data.image?.original || '',
      }
    },
    score: data.score ? parseFloat(data.score) : 0,
    scored_by: data.scores_count || 0,
    rank: data.rank,
    popularity: data.popularity,
    episodes: data.episodes || 0,
    status: data.status,
    aired: {
      from: data.aired_on,
      to: data.released_on,
      string: data.aired_on ? `${data.aired_on} - ${data.released_on || '?'}` : '?'
    },
    year: data.year,
    genres: (data.genres || []).map((g: any) => ({
      mal_id: g.id,
      name: g.name
    })),
    studios: (data.studios || []).map((s: any) => ({
      mal_id: s.id,
      name: s.name
    })),
    type: data.kind?.toUpperCase(),
    rating: data.rating,
    duration: data.duration ? `${data.duration} min` : undefined,
    trailer: data.videos?.[0] ? { youtube_id: data.videos[0].url.split('/').pop() } : undefined,
  };
}

export async function getTopAnime(page = 1, limit = 24): Promise<Anime[]> {
  // Кэширование на 10 минут (600 000 мс)
  const cacheKey = `top_anime_${page}_${limit}`;
  const cached = apiCache.get<Anime[]>(cacheKey);
  if (cached) return cached;

  const offset = (page - 1) * limit;
  const res = await fetchWithRetry(
    `${BASE}/animes?page=${page}&limit=${limit}&order=ranked&kind=tv`
  );
  if (!res.ok) return [];
  const data = await res.json();
  const result = (Array.isArray(data) ? data : []).map(transformShikimoriAnime);
  
  // Сохраняем в кэш на 10 минут
  apiCache.set(cacheKey, result, 10 * 60 * 1000);
  return result;
}

export async function getSeasonalAnime(limit = 24): Promise<Anime[]> {
  // Кэширование на 10 минут
  const cacheKey = `seasonal_anime_${limit}`;
  const cached = apiCache.get<Anime[]>(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const month = now.getMonth() + 1;
  let season = 'winter';
  if (month >= 3 && month < 6) season = 'spring';
  else if (month >= 6 && month < 9) season = 'summer';
  else if (month >= 9 && month < 12) season = 'fall';
  
  const year = now.getFullYear();
  const res = await fetchWithRetry(
    `${BASE}/animes?season=${year}_${season}&kind=tv&order=popularity&limit=${limit}`
  );
  if (!res.ok) return [];
  const data = await res.json();
  const result = (Array.isArray(data) ? data : []).map(transformShikimoriAnime);
  
  apiCache.set(cacheKey, result, 10 * 60 * 1000);
  return result;
}

export async function searchAnime(query: string, page = 1): Promise<{ results: Anime[]; total: number }> {
  if (!query.trim()) return { results: [], total: 0 };
  
  const res = await fetchWithRetry(
    `${BASE}/animes?search=${encodeURIComponent(query)}&page=${page}&limit=20`
  );
  if (!res.ok) return { results: [], total: 0 };
  
  const data = await res.json();
  return {
    results: (Array.isArray(data) ? data : []).map(transformShikimoriAnime),
    total: Array.isArray(data) ? data.length * 5 : 0, // Approximate
  };
}

export async function getAnimeById(id: number): Promise<Anime | null> {
  const res = await fetchWithRetry(`${BASE}/animes/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return transformShikimoriAnime(data);
}

export async function getAnimeByGenre(genreId: number, page = 1): Promise<Anime[]> {
  const res = await fetchWithRetry(
    `${BASE}/animes?genre=${genreId}&kind=tv&page=${page}&limit=20&order=popularity`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (Array.isArray(data) ? data : []).map(transformShikimoriAnime);
}

export async function getUpcomingAnime(limit = 12): Promise<Anime[]> {
  const res = await fetchWithRetry(
    `${BASE}/animes?status=anons&kind=tv&limit=${limit}&order=popularity`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (Array.isArray(data) ? data : []).map(transformShikimoriAnime);
}

// Get video players for anime
export async function getAnimeVideos(animeId: number): Promise<any[]> {
  try {
    const res = await fetchWithRetry(`${BASE}/animes/${animeId}/videos`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Get external links (players) for anime
export async function getAnimeExternals(animeId: number): Promise<any[]> {
  try {
    const res = await fetchWithRetry(`${BASE}/animes/${animeId}/external_links`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Build player URLs for different services
export function buildPlayerUrl(animeId: number, episode: number, season: number, playerType: 'kodik' | 'alloha' | 'cvh'): string {
  switch (playerType) {
    case 'kodik':
      // Kodik requires specific anime ID mapping - using anime title as fallback
      return `https://kodik.info/search?types=anime&q=anime%20${animeId}`;
    
    case 'alloha':
      // Alloha player format
      return `https://alloha.tv/?p=play&vid=${animeId}-${season}-${episode}`;
    
    case 'cvh':
      // CVH/vidsrc format (supports MAL IDs)
      return `https://vidsrc.cc/v2/embed/anime/${animeId}/${season}/${episode}?autoPlay=true&color=9333ea`;
    
    default:
      return '';
  }
}
