import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Loader2, TrendingUp } from 'lucide-react';
import { searchAnime, getTopAnime, getAnimeByGenre } from '../api/jikan';
import type { Anime } from '../types/anime';
import AnimeCard from '../components/AnimeCard';

const GENRES = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 14, name: 'Horror' },
  { id: 7, name: 'Mystery' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 36, name: 'Slice of Life' },
  { id: 30, name: 'Sports' },
  { id: 37, name: 'Supernatural' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [trending, setTrending] = useState<Anime[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Load trending on mount
  useEffect(() => {
    getTopAnime(1, 20).then(setTrending);
  }, []);

  const doSearch = useCallback(async (q: string, p: number, genreId: number | null) => {
    setLoading(true);
    try {
      if (q.trim()) {
        const { results: res, total: t } = await searchAnime(q, p);
        setResults(p === 1 ? res : prev => [...prev, ...res]);
        setTotal(t);
      } else if (genreId !== null) {
        const res = await getAnimeByGenre(genreId, p);
        setResults(p === 1 ? res : prev => [...prev, ...res]);
        setTotal(999);
      } else {
        setResults([]);
        setTotal(0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    setPage(1);
    if (!query.trim() && selectedGenre === null) {
      setResults([]);
      setTotal(0);
      return;
    }
    const timer = setTimeout(() => {
      doSearch(query, 1, selectedGenre);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, selectedGenre, doSearch]);

  const handleGenre = (id: number) => {
    if (selectedGenre === id) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(id);
      setQuery('');
    }
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    doSearch(query, next, selectedGenre);
  };

  const hasResults = results.length > 0;
  const showTrending = !hasResults && !loading && !query.trim() && selectedGenre === null;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto" style={{ color: '#fff' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Search Anime</h1>
        <p className="text-gray-400">Find your next favorite series</p>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search anime titles..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl text-white placeholder-gray-500 text-base outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-14 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`absolute right-4 transition-colors ${showFilters ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Genre filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 py-2">
                {GENRES.map(g => (
                  <button
                    key={g.id}
                    onClick={() => handleGenre(g.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedGenre === g.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Loading */}
      {loading && results.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-10 h-10 text-purple-500" />
          </motion.div>
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <div>
          <p className="text-gray-400 text-sm mb-4">
            {selectedGenre
              ? `Showing ${GENRES.find(g => g.id === selectedGenre)?.name} anime`
              : `Found ${total.toLocaleString()} results for "${query}"`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((a, i) => (
              <AnimeCard key={`${a.mal_id}-${i}`} anime={a} index={i % 10} />
            ))}
          </div>
          {results.length < total && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Load More
              </button>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!hasResults && !loading && query.trim() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-gray-400">Try a different search term</p>
        </motion.div>
      )}

      {/* Trending */}
      {showTrending && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trending.map((a, i) => (
              <AnimeCard key={a.mal_id} anime={a} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
