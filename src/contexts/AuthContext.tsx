
import type { User } from 'firebase/auth';
import { createContext } from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // signInWithGoogle: () => Promise<void>; // Removed
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
