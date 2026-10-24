'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme-store';

const themeColors: Record<string, string> = {
  blue: '#3b82f6',
  emerald: '#10b981',
  violet: '#8b5cf6',
  rose: '#f43f5e',
  amber: '#f59e0b',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const accent = useThemeStore((state) => state.accent);

  useEffect(() => {
    const root = document.documentElement;
    const hex = themeColors[accent] || themeColors.blue;
    // Set custom CSS variables that Tailwind can read or we can use in styles
    root.style.setProperty('--theme-accent', hex);
    // Add data attribute for easier tailwind selecting if needed
    root.setAttribute('data-theme', accent);
  }, [accent]);

  return <>{children}</>;
}
