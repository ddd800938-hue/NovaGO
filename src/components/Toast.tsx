import { useState, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl max-w-xs"
              style={{
                background: t.type === 'success' ? 'rgba(22, 101, 52, 0.95)' :
                            t.type === 'error' ? 'rgba(153, 27, 27, 0.95)' :
                            'rgba(15, 15, 26, 0.95)',
                border: `1px solid ${
                  t.type === 'success' ? 'rgba(34,197,94,0.3)' :
                  t.type === 'error' ? 'rgba(239,68,68,0.3)' :
                  'rgba(255,255,255,0.1)'
                }`,
                backdropFilter: 'blur(20px)',
              }}
            >
              {t.type === 'success' && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
              {t.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
              <p className="text-sm text-white">{t.message}</p>
              <button onClick={() => remove(t.id)} className="text-white/50 hover:text-white ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
