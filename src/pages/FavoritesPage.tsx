import { motion } from 'framer-motion';
import { Heart, Trash2, Play } from 'lucide-react';
import { useFavorites, useNavigation } from '../store/useStore';
import AnimeCard from '../components/AnimeCard';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-7 h-7 text-red-400" fill="currentColor" />
          <h1 className="text-3xl font-bold text-white">My Favorites</h1>
        </div>
        <p className="text-gray-400">
          {favorites.length > 0
            ? `${favorites.length} anime saved`
            : 'Your collection is empty'}
        </p>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center">
              <Heart className="w-12 h-12 text-red-400/50" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-red-500/20"
            />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No favorites yet</h2>
          <p className="text-gray-400 mb-6 max-w-xs">
            Browse anime and click the heart icon to save your favorites here
          </p>
          <button
            onClick={() => navigate('search')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <Play className="w-4 h-4" />
            Explore Anime
          </button>
        </motion.div>
      ) : (
        <>
          {/* Quick actions */}
          <div className="flex items-center justify-end mb-4">
            <button
              onClick={() => {
                if (confirm('Clear all favorites?')) {
                  favorites.forEach(a => removeFavorite(a.mal_id));
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((anime, i) => (
              <motion.div
                key={anime.mal_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
              >
                <AnimeCard anime={anime} index={i} />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
