import { useState, useEffect, useCallback } from 'react';
import type { Anime, User, Page, WatchingAnime } from '../types/anime';

const STORAGE_KEYS = {
  USER: 'novago_user',
  FAVORITES: 'novago_favorites',
  HISTORY: 'novago_history',
  USERS_DB: 'novago_users_db',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* empty */ }
}

const listeners: Record<string, Set<() => void>> = {};

function subscribe(key: string, fn: () => void): () => void {
  if (!listeners[key]) listeners[key] = new Set();
  listeners[key].add(fn);
  return () => { listeners[key].delete(fn); };
}

function notify(key: string) {
  listeners[key]?.forEach(fn => fn());
}

// --- User Store ---
let _user: User | null = loadFromStorage(STORAGE_KEYS.USER, null);

export function useUser() {
  const [user, setUser] = useState<User | null>(_user);

  useEffect(() => {
    return subscribe('user', () => setUser(_user));
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const users: Record<string, { user: User; password: string }> = loadFromStorage(STORAGE_KEYS.USERS_DB, {});
    const entry = users[email.toLowerCase()];
    if (!entry || entry.password !== password) return false;
    _user = entry.user;
    saveToStorage(STORAGE_KEYS.USER, _user);
    notify('user');
    return true;
  }, []);

  const register = useCallback((email: string, username: string, password: string): boolean => {
    const users: Record<string, { user: User; password: string }> = loadFromStorage(STORAGE_KEYS.USERS_DB, {});
    if (users[email.toLowerCase()]) return false;
    const newUser: User = {
      id: Math.random().toString(36).slice(2),
      email,
      username,
      createdAt: new Date().toISOString(),
    };
    users[email.toLowerCase()] = { user: newUser, password };
    saveToStorage(STORAGE_KEYS.USERS_DB, users);
    _user = newUser;
    saveToStorage(STORAGE_KEYS.USER, _user);
    notify('user');
    return true;
  }, []);

  const logout = useCallback(() => {
    _user = null;
    localStorage.removeItem(STORAGE_KEYS.USER);
    notify('user');
  }, []);

  return { user, login, register, logout };
}

// --- Favorites Store ---
let _favorites: Anime[] = loadFromStorage(STORAGE_KEYS.FAVORITES, []);

export function useFavorites() {
  const [favorites, setFavorites] = useState<Anime[]>(_favorites);

  useEffect(() => {
    return subscribe('favorites', () => setFavorites([..._favorites]));
  }, []);

  const addFavorite = useCallback((anime: Anime) => {
    if (_favorites.find(a => a.mal_id === anime.mal_id)) return;
    _favorites = [..._favorites, anime];
    saveToStorage(STORAGE_KEYS.FAVORITES, _favorites);
    notify('favorites');
  }, []);

  const removeFavorite = useCallback((mal_id: number) => {
    _favorites = _favorites.filter(a => a.mal_id !== mal_id);
    saveToStorage(STORAGE_KEYS.FAVORITES, _favorites);
    notify('favorites');
  }, []);

  const isFavorite = useCallback((mal_id: number): boolean => {
    return _favorites.some(a => a.mal_id === mal_id);
  }, []);

  const toggleFavorite = useCallback((anime: Anime) => {
    if (_favorites.find(a => a.mal_id === anime.mal_id)) {
      removeFavorite(anime.mal_id);
    } else {
      addFavorite(anime);
    }
  }, [addFavorite, removeFavorite]);

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}

// --- History Store ---
let _history: WatchingAnime[] = loadFromStorage(STORAGE_KEYS.HISTORY, []);

export function useHistory() {
  const [history, setHistory] = useState<WatchingAnime[]>(_history);

  useEffect(() => {
    return subscribe('history', () => setHistory([..._history]));
  }, []);

  const addToHistory = useCallback((entry: WatchingAnime) => {
    _history = _history.filter(h => h.anime.mal_id !== entry.anime.mal_id);
    _history = [entry, ..._history].slice(0, 20);
    saveToStorage(STORAGE_KEYS.HISTORY, _history);
    notify('history');
  }, []);

  return { history, addToHistory };
}

// --- Navigation ---
let _page: Page = 'home';
let _watchingAnime: WatchingAnime | null = null;

export function useNavigation() {
  const [page, setPage] = useState<Page>(_page);
  const [watching, setWatching] = useState<WatchingAnime | null>(_watchingAnime);

  useEffect(() => {
    return subscribe('nav', () => {
      setPage(_page);
      setWatching(_watchingAnime);
    });
  }, []);

  const navigate = useCallback((p: Page, anime?: WatchingAnime) => {
    _page = p;
    _watchingAnime = anime ?? null;
    notify('nav');
  }, []);

  return { page, watching, navigate };
}
