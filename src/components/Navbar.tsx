import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, User, Home, LogIn, Menu, X, Tv } from 'lucide-react';
import { useUser, useNavigation } from '../store/useStore';

export default function Navbar() {
  const { user, logout } = useUser();
  const { navigate, page } = useNavigation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const navItems = [
    { label: 'Home', icon: Home, page: 'home' as const },
    { label: 'Search', icon: Search, page: 'search' as const },
    { label: 'Favorites', icon: Heart, page: 'favorites' as const },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5"
      style={{ background: 'rgba(8, 8, 16, 0.92)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => { navigate('home'); setMobileOpen(false); }}
            className="flex items-center gap-2 group"
          >
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 opacity-90 group-hover:opacity-100 transition-opacity" />
              <Tv className="relative z-10 w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Nova<span className="text-white">GO</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  page === item.page
                    ? 'bg-purple-600/20 text-purple-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {page === item.page && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* User section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300">{user.username}</span>
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 shadow-2xl overflow-hidden"
                      style={{ background: '#0f0f1a' }}
                    >
                      <button
                        onClick={() => { navigate('profile'); setUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" /> Profile
                      </button>
                      <button
                        onClick={() => { navigate('favorites'); setUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                      >
                        <Heart className="w-4 h-4" /> Favorites
                      </button>
                      <div className="border-t border-white/10" />
                      <button
                        onClick={() => { logout(); setUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogIn className="w-4 h-4 rotate-180" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => navigate('auth')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5 overflow-hidden"
            style={{ background: 'rgba(8, 8, 16, 0.98)' }}
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.page}
                  onClick={() => { navigate(item.page); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    page === item.page
                      ? 'bg-purple-600/20 text-purple-300'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              <div className="border-t border-white/10 pt-2 mt-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-400">Signed in as <span className="text-purple-400">{user.username}</span></div>
                    <button
                      onClick={() => { navigate('profile'); setMobileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogIn className="w-4 h-4 rotate-180" /> Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { navigate('auth'); setMobileOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-medium"
                  >
                    <LogIn className="w-4 h-4" /> Sign In / Register
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
