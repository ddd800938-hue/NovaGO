import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Star, Heart, Play, ChevronLeft, ChevronRight,
  Info, BookOpen, Calendar, Tv
} from 'lucide-react';
import type { WatchingAnime, PlayerType } from '../types/anime';
import { useFavorites, useNavigation, useHistory } from '../store/useStore';
import { getAnimeById, buildPlayerUrl } from '../api/shikimori';

interface Props {
  watching: WatchingAnime;
}

export default function WatchPage({ watching }: Props) {
  const { navigate } = useNavigation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToHistory } = useHistory();

  const [anime, setAnime] = useState(watching.anime);
  const [episode, setEpisode] = useState(watching.episode);
  const [season] = useState(watching.season);
  const [activeTab, setActiveTab] = useState<'info' | 'episodes'>('info');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerType>('cvh');
  const [playerError, setPlayerError] = useState(false);

  const fav = isFavorite(anime.mal_id);
  const title = anime.title_english || anime.title;
  const totalEpisodes = anime.episodes || 12;

  // Fetch full details
  useEffect(() => {
    getAnimeById(watching.anime.mal_id).then(full => {
      if (full) setAnime(full);
    });
  }, [watching.anime.mal_id]);

  // Track history
  useEffect(() => {
    addToHistory({ anime, episode, season });
  }, [anime.mal_id, episode, season, addToHistory]);

  // Get player URL based on selected player
  const playerUrl = buildPlayerUrl(anime.mal_id, episode, season, selectedPlayer);
  const players: { type: PlayerType; name: string; icon: string }[] = [
    { type: 'cvh', name: 'CVH', icon: '🎬' },
    { type: 'kodik', name: 'Kodik', icon: '▶️' },
    { type: 'alloha', name: 'Alloha', icon: '🎞️' },
  ];

  const episodeNumbers = Array.from({ length: Math.min(totalEpisodes, 200) }, (_, i) => i + 1);

  return (
    <div className="min-h-screen pt-16" style={{ background: '#080810' }}>
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {/* Player selector tabs */}
        <div className="mb-4 flex gap-2 flex-wrap">
          {players.map(player => (
            <button
              key={player.type}
              onClick={() => {
                setSelectedPlayer(player.type);
                setPlayerError(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPlayer === player.type
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <span>{player.icon}</span>
              {player.name}
            </button>
          ))}
        </div>

        {/* Player */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/20 mb-6"
          style={{ background: '#000' }}
        >
          {playerError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="text-center">
                <p className="text-white mb-2">Player not available</p>
                <p className="text-sm text-gray-400">Try another player</p>
              </div>
            </div>
          )}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              key={`${anime.mal_id}-${season}-${episode}-${selectedPlayer}`}
              src={playerUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen"
              referrerPolicy="no-referrer"
              style={{ border: 'none' }}
              onError={() => setPlayerError(true)}
            />
          </div>
        </motion.div>

        {/* Episode controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 mt-1">Episode {episode} {totalEpisodes > 1 ? `of ${totalEpisodes}` : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEpisode(e => Math.max(1, e - 1))}
              disabled={episode <= 1}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            <button
              onClick={() => setEpisode(e => Math.min(totalEpisodes, e + 1))}
              disabled={episode >= totalEpisodes}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Info + Episodes */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: '#0f0f1a' }}>
              {(['info', 'episodes'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab === 'info' ? <Info className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'info' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl p-5 space-y-4"
                style={{ background: '#0f0f1a' }}
              >
                {anime.synopsis && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Synopsis</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">{anime.synopsis}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {anime.score && (
                    <InfoItem icon={<Star className="w-4 h-4 text-yellow-400" fill="currentColor" />} label="Score" value={`${anime.score.toFixed(2)} / 10`} />
                  )}
                  {anime.status && (
                    <InfoItem icon={<Play className="w-4 h-4 text-green-400" />} label="Status" value={anime.status} />
                  )}
                  {anime.aired?.string && (
                    <InfoItem icon={<Calendar className="w-4 h-4 text-blue-400" />} label="Aired" value={anime.aired.string} />
                  )}
                  {anime.type && (
                    <InfoItem icon={<Tv className="w-4 h-4 text-purple-400" />} label="Type" value={anime.type} />
                  )}
                </div>

                {anime.genres && anime.genres.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map(g => (
                        <span key={g.mal_id} className="px-3 py-1 rounded-full bg-purple-900/40 text-purple-300 text-sm border border-purple-800/30">
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {anime.studios && anime.studios.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Studio</h3>
                    <div className="flex flex-wrap gap-2">
                      {anime.studios.map(s => (
                        <span key={s.mal_id} className="px-3 py-1 rounded-lg bg-white/5 text-gray-300 text-sm">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'episodes' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl p-5"
                style={{ background: '#0f0f1a' }}
              >
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-80 overflow-y-auto">
                  {episodeNumbers.map(ep => (
                    <button
                      key={ep}
                      onClick={() => setEpisode(ep)}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                        ep === episode
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {ep}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Anime info card */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden" style={{ background: '#0f0f1a' }}>
              <img
                src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                alt={title}
                className="w-full object-cover"
                style={{ maxHeight: 300, objectPosition: 'top' }}
              />
              <div className="p-4">
                <h2 className="font-bold text-white mb-1">{title}</h2>
                {anime.title_japanese && (
                  <p className="text-gray-500 text-sm mb-3">{anime.title_japanese}</p>
                )}

                <button
                  onClick={() => toggleFavorite(anime)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all ${
                    fav
                      ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                      : 'bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={fav ? 'currentColor' : 'none'} />
                  {fav ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl p-4 space-y-3" style={{ background: '#0f0f1a' }}>
              {anime.rank && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rank</span>
                  <span className="text-white font-medium">#{anime.rank}</span>
                </div>
              )}
              {anime.popularity && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Popularity</span>
                  <span className="text-white font-medium">#{anime.popularity}</span>
                </div>
              )}
              {anime.scored_by && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Scored by</span>
                  <span className="text-white font-medium">{anime.scored_by.toLocaleString()} users</span>
                </div>
              )}
              {anime.duration && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-medium">{anime.duration}</span>
                </div>
              )}
              {anime.rating && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rating</span>
                  <span className="text-white font-medium">{anime.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: '#080810' }}>
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-white font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}
