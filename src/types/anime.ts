export interface AnimeImage {
  jpg: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
  webp?: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
}

export interface AnimeGenre {
  mal_id: number;
  name: string;
}

export interface AnimeStudio {
  mal_id: number;
  name: string;
}

export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  synopsis?: string;
  images: AnimeImage;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  episodes?: number;
  status?: string;
  aired?: {
    from?: string;
    to?: string;
    string?: string;
  };
  season?: string;
  year?: number;
  genres?: AnimeGenre[];
  studios?: AnimeStudio[];
  type?: string;
  rating?: string;
  duration?: string;
  trailer?: {
    youtube_id?: string;
    url?: string;
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export type Page = 'home' | 'search' | 'watch' | 'favorites' | 'profile' | 'auth';

export type PlayerType = 'kodik' | 'alloha' | 'cvh';

export interface PlayerLink {
  type: PlayerType;
  url: string;
  name: string;
  icon?: string;
}

export interface WatchingAnime {
  anime: Anime;
  episode: number;
  season: number;
}
