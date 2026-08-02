import { create } from 'zustand';
import type { AuthSession, User } from '@/types/domain';

interface AuthState {
  session: AuthSession | null;
  user: User | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  signIn: (session) => set({ session, user: session.user }),
  signOut: () => set({ session: null, user: null }),
}));
