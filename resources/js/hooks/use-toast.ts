import { useState } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant || 'default',
      duration: options.duration || 5000,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss
    setTimeout(() => {
      dismiss(id);
    }, newToast.duration);

    return id;
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const dismissAll = () => {
    setToasts([]);
  };

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
  };
}
