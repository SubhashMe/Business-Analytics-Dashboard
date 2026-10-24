import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  username: string;
  name: string;
  role: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username: string, password: string) => {
        // Strict case-sensitive match as required
        if (username === 'Admin' && password === 'Admin@123') {
          const authUser: User = {
            username: 'Admin',
            name: 'Alex Admin',
            role: 'VP of Sales & Analytics',
            email: 'admin@dealflow-crm.com',
          };
          set({ isAuthenticated: true, user: authUser });
          return { success: true };
        }
        return { success: false, error: 'Invalid credentials. Please verify your username and password.' };
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'dealflow-auth-session',
    }
  )
);
