import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import WatchPage from './pages/WatchPage';
import FavoritesPage from './pages/FavoritesPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import { useNavigation } from './store/useStore';
import Footer from './components/Footer';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function PageWrapper({ children, pageKey }: { children: React.ReactNode; pageKey: string }) {
  return (
    <motion.div
      key={pageKey}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const { page, watching } = useNavigation();

  return (
    <div className="min-h-screen" style={{ background: '#080810' }}>
      <Navbar />

      <AnimatePresence mode="wait">
        {page === 'home' && (
          <PageWrapper pageKey="home">
            <HomePage />
          </PageWrapper>
        )}

        {page === 'search' && (
          <PageWrapper pageKey="search">
            <SearchPage />
          </PageWrapper>
        )}

        {page === 'watch' && watching && (
          <PageWrapper pageKey={`watch-${watching.anime.mal_id}-${watching.episode}`}>
            <WatchPage watching={watching} />
          </PageWrapper>
        )}

        {page === 'favorites' && (
          <PageWrapper pageKey="favorites">
            <FavoritesPage />
          </PageWrapper>
        )}

        {page === 'auth' && (
          <PageWrapper pageKey="auth">
            <AuthPage />
          </PageWrapper>
        )}

        {page === 'profile' && (
          <PageWrapper pageKey="profile">
            <ProfilePage />
          </PageWrapper>
        )}
      </AnimatePresence>

      {page !== 'watch' && <Footer />}
    </div>
  );
}
