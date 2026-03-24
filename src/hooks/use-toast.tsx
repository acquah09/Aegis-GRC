// src/hooks/use-toast.ts
// Toast hook for displaying notifications

import { useState, useCallback } from 'react';
import { ReactNode, Fragment } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

let toastCount = 0;

export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 5000 }: Omit<Toast, 'id'>) => {
      const id = `${toastCount++}`;
      const newToast: Toast = {
        id,
        title,
        description,
        variant,
        duration,
      };

      setState((prevState) => ({
        toasts: [...prevState.toasts, newToast],
      }));

      // Auto remove toast after duration
      setTimeout(() => {
        setState((prevState) => ({
          toasts: prevState.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    },
    [setState]
  );

  const dismiss = useCallback((toastId: string) => {
    setState((prevState) => ({
      toasts: prevState.toasts.filter((t) => t.id !== toastId),
    }));
  }, [setState]);

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  };
}

// Toast provider component for the app
interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  return (
    <>
      {children}
      {/* Toast container */}
      <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4">
        {state.toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg border p-4 shadow-lg transition-all max-w-sm w-full bg-background text-foreground ${
              toast.variant === 'destructive'
                ? 'border-destructive bg-destructive text-destructive-foreground'
                : 'border-border'
            }`}
          >
            {toast.title && (
              <div className="font-semibold">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm opacity-90 mt-1">{toast.description}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
