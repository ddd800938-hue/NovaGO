import { Tv } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-10" style={{ background: '#060610' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <Tv className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Nova<span className="text-white">GO</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">About</a>
            <a href="#" className="hover:text-gray-300 transition-colors">DMCA</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold">
              GH
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold">
              TW
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-600">
          <p>© 2025 NovaGO. All content is sourced from third-party providers.</p>
          <p className="mt-1">Anime data provided by <a href="https://myanimelist.net" className="text-purple-500 hover:text-purple-400">MyAnimeList</a> via Jikan API.</p>
        </div>
      </div>
    </footer>
  );
}
