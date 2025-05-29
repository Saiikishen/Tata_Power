'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { auth, googleProvider } from '@/lib/firebase';
import { PATHS } from '@/lib/constants';

interface FirebaseAuthProviderProps {
  children: ReactNode;
}

export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      // Auth state change will be handled by onAuthStateChanged
      // router.push(PATHS.DASHBOARD); // Consider if navigation should happen here or in page
    } catch (error) {
      console.error("Error signing in with Google:", error);
      // Handle error (e.g., show toast)
    } finally {
      // setLoading(false); // onAuthStateChanged will set loading to false
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      router.push(PATHS.LOGIN);
    } catch (error)
    {
      console.error("Error signing out:", error);
      // Handle error
    } finally {
      // setLoading(false); // onAuthStateChanged will set loading to false
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
