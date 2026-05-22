import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Sparkles, Clock, ChevronRight, Star } from 'lucide-react';
import { getTopAnime, getSeasonalAnime } from '../api/jikan';
import type { Anime } from '../types/anime';
import AnimeCard from '../components/AnimeCard';
import { useNavigation, useHistory } from '../store/useStore';

export default function HomePage() {
  const [topAnime, setTopAnime] = useState<Anime[]>([]);
  const [seasonal, setSeasonal] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroAnime, setHeroAnime] = useState<Anime | null>(null);
  const { navigate } = useNavigation();
  const { history } = useHistory();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [top, season] = await Promise.all([
          getTopAnime(1, 20),
          getSeasonalAnime(20),
        ]);
        setTopAnime(top);
        setSeasonal(season);
        if (top.length > 0) setHeroAnime(top[0]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const bgImg = heroAnime?.images?.jpg?.large_image_url;
  const heroTitle = heroAnime?.title_english || heroAnime?.title;

  return (
    <div className="min-h-screen" style={{ background: '#080810' }}>
      {/* Hero Section */}
      <div className="relative min-h-[85vh] flex items-end overflow-hidden">
        {/* Background */}
        {bgImg && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
              style={{ backgroundImage: `url(${bgImg})`, filter: 'blur(2px)', transform: 'scale(1.05)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-[#080810]/70 to-[#080810]/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080810]/80 via-transparent to-transparent" />
          </>
        )}
        {!bgImg && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-[#080810] to-cyan-950" />
        )}

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-purple-400/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 pt-28 w-full">
          {heroAnime ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> #1 Trending
                </span>
                {heroAnime.score && (
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" fill="currentColor" /> {heroAnime.score.toFixed(1)}
                  </span>
                )}
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white mb-3 leading-tight">
                {heroTitle}
              </h1>

              {heroAnime.synopsis && (
                <p className="text-gray-300 text-base leading-relaxed mb-6 line-clamp-3">
                  {heroAnime.synopsis}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mb-6">
                {heroAnime.genres?.slice(0, 3).map(g => (
                  <span key={g.mal_id} className="px-3 py-1 rounded-full border border-white/10 text-gray-300 text-sm bg-white/5">
                    {g.name}
                  </span>
                ))}
                {heroAnime.episodes && (
                  <span className="text-gray-400 text-sm">{heroAnime.episodes} episodes</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('watch', { anime: heroAnime, episode: 1, season: 1 })}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 transition-shadow"
                >
                  <Play className="w-5 h-5" fill="white" />
                  Watch Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('search')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/10 hover:bg-white/15 transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Explore All
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <div className="max-w-2xl space-y-4">
              {[300, 400, 200, 100].map((w, i) => (
                <div key={i} className="h-6 rounded-lg bg-white/5 animate-pulse" style={{ width: w }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Continue Watching */}
      {history.length > 0 && (
        <Section title="Continue Watching" icon={<Clock className="w-5 h-5 text-cyan-400" />}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {history.slice(0, 6).map((h, i) => (
              <AnimeCard key={h.anime.mal_id} anime={h.anime} index={i} />
            ))}
          </div>
        </Section>
      )}

      {/* This Season */}
      <Section
        title="This Season"
        icon={<Sparkles className="w-5 h-5 text-purple-400" />}
        onMore={() => navigate('search')}
      >
        {loading ? (
          <GridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {seasonal.slice(0, 12).map((a, i) => (
              <AnimeCard key={a.mal_id} anime={a} index={i} />
            ))}
          </div>
        )}
      </Section>

      {/* Top Anime */}
      <Section
        title="Top Rated"
        icon={<TrendingUp className="w-5 h-5 text-yellow-400" />}
        onMore={() => navigate('search')}
      >
        {loading ? (
          <GridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {topAnime.slice(1, 13).map((a, i) => (
              <AnimeCard key={a.mal_id} anime={a} index={i} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, icon, children, onMore }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onMore?: () => void;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        {onMore && (
          <button
            onClick={onMore}
            className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            See all <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function GridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden" style={{ background: '#0f0f1a' }}>
          <div className="aspect-[3/4] bg-white/5 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-white/5 rounded animate-pulse" />
            <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
