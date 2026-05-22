import { motion } from 'framer-motion';
import { Star, Play, Heart } from 'lucide-react';
import type { Anime } from '../types/anime';
import { useFavorites, useNavigation } from '../store/useStore';
import { useToast } from './Toast';

interface Props {
  anime: Anime;
  index?: number;
}

export default function AnimeCard({ anime, index = 0 }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const fav = isFavorite(anime.mal_id);
  const title = anime.title_english || anime.title;
  const img = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative rounded-xl overflow-hidden cursor-pointer"
      style={{ background: '#0f0f1a' }}
      onClick={() => navigate('watch', { anime, episode: 1, season: 1 })}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-purple-600/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-purple-900/50"
          >
            <Play className="w-6 h-6 text-white ml-1" fill="white" />
          </motion.div>
        </div>

        {/* Score badge */}
        {anime.score && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
            <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
            <span className="text-xs text-white font-semibold">{anime.score.toFixed(1)}</span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={e => {
            e.stopPropagation();
            toggleFavorite(anime);
            showToast(fav ? 'Removed from favorites' : 'Added to favorites!', fav ? 'info' : 'success');
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
            fav
              ? 'bg-red-500/80 text-white'
              : 'bg-black/60 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className="w-4 h-4" fill={fav ? 'currentColor' : 'none'} />
        </button>

        {/* Type badge */}
        {anime.type && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-purple-600/80 backdrop-blur-sm">
            <span className="text-xs text-white font-medium">{anime.type}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          {anime.episodes && (
            <span className="text-xs text-gray-500">{anime.episodes} eps</span>
          )}
          {anime.year && (
            <span className="text-xs text-gray-500">· {anime.year}</span>
          )}
        </div>
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {anime.genres.slice(0, 2).map(g => (
              <span key={g.mal_id} className="text-xs px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300">
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
