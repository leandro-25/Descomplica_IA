import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Icons } from '../components/icons';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastIcons: Record<ToastType, React.FC<{ size?: number; className?: string }>> = {
  success: Icons.CheckCircle2,
  error: Icons.Trash2,
  info: Icons.Info,
  warning: Icons.Flame,
};

const toastIconColors: Record<ToastType, string> = {
  success: '#16A34A',
  error: '#DC2626',
  info: '#3B82F6',
  warning: '#F59E0B',
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type, duration };
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => dismissToast(id), duration);
    }
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};

export const ToastPortal: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-portal" className="fixed top-4 right-4 z-[600] flex flex-col gap-2 max-w-[400px] w-full px-4 pointer-events-none">
      {toasts.map(toast => {
        const Icon = toastIcons[toast.type];
        const color = toastIconColors[toast.type];
        return (
          <div
            key={toast.id}
            className={`toast ${toast.type} pointer-events-auto animate-slide-down`}
            role="alert"
            aria-live="polite"
          >
            <span style={{ color }} className="flex-shrink-0 mt-0.5">
              <Icon size={14} />
            </span>
            <div className="flex-1 text-sm">{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 text-[var(--ink-4)] hover:text-[var(--ink)] transition-colors flex-shrink-0"
              aria-label="Fechar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};
