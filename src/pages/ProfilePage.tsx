import { motion } from 'framer-motion';
import { User, Heart, Clock, LogOut, Star, Calendar } from 'lucide-react';
import { useUser, useNavigation, useFavorites, useHistory } from '../store/useStore';
import AnimeCard from '../components/AnimeCard';

export default function ProfilePage() {
  const { user, logout } = useUser();
  const { navigate } = useNavigation();
  const { favorites } = useFavorites();
  const { history } = useHistory();

  if (!user) {
    navigate('auth');
    return null;
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const favoritesWithScore = favorites.filter(a => a.score);
  const avgScore = favoritesWithScore.length > 0
    ? (favoritesWithScore.reduce((s, a) => s + (a.score || 0), 0) / favoritesWithScore.length).toFixed(1)
    : '—';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-8 p-8"
        style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0f0f1a 50%, #0a1a2e 100%)' }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-purple-600/15 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-cyan-600/15 blur-3xl" />
        </div>

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-purple-900/30">
              {user.username[0].toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#080810]" />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-black text-white mb-1">{user.username}</h1>
            <p className="text-gray-400 mb-3">{user.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              Joined {joinDate}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => { logout(); navigate('home'); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: Heart, label: 'Favorites', value: favorites.length, color: 'text-red-400', bg: 'bg-red-500/10' },
            { icon: Clock, label: 'Watched', value: history.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Star, label: 'Avg Score', value: avgScore, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          ].map(stat => (
            <div key={stat.label} className={`flex flex-col items-center p-4 rounded-2xl ${stat.bg} border border-white/5`}>
              <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} fill={stat.label === 'Favorites' ? 'currentColor' : 'none'} />
              <span className="text-2xl font-black text-white">{stat.value}</span>
              <span className="text-xs text-gray-400 mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent History */}
      {history.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Watch History</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {history.slice(0, 6).map((h, i) => (
              <AnimeCard key={h.anime.mal_id} anime={h.anime} index={i} />
            ))}
          </div>
        </motion.section>
      )}

      {/* Favorites */}
      {favorites.length > 0 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-5">
            <Heart className="w-5 h-5 text-red-400" fill="currentColor" />
            <h2 className="text-xl font-bold text-white">Favorites</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.slice(0, 12).map((a, i) => (
              <AnimeCard key={a.mal_id} anime={a} index={i} />
            ))}
          </div>
          {favorites.length > 12 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => navigate('favorites')}
                className="px-5 py-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-sm"
              >
                View All {favorites.length} Favorites
              </button>
            </div>
          )}
        </motion.section>
      )}

      {/* Empty state */}
      {favorites.length === 0 && history.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Your profile is empty</h3>
          <p className="text-gray-400 mb-6">Start watching anime to fill your profile!</p>
          <button
            onClick={() => navigate('home')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold"
          >
            Start Watching
          </button>
        </motion.div>
      )}
    </div>
  );
}
