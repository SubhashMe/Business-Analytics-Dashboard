import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeState = {
  accent: string;
  setAccent: (accent: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      accent: 'blue',
      setAccent: (accent) => set({ accent }),
      theme: 'light',
      setTheme: (_theme) => {
        set({ theme: 'light' });
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.className = root.className.replace(/\btheme-\S+/g, '');
          root.classList.add('theme-light');
        }
      },
    }),
    {
      name: 'dealflow-theme-storage',
    }
  )
);
