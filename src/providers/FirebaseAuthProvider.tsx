
'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut as firebaseSignOut, type AuthError } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase'; // googleProvider is no longer needed here
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
      if (!currentUser && (window.location.pathname !== PATHS.LOGIN && window.location.pathname !== PATHS.SIGNUP && window.location.pathname !== PATHS.HOME)) {
        // router.push(PATHS.LOGIN); // Commented out to avoid redirect loops on initial load if user is not logged in and not on public pages
      }
    });
    return () => unsubscribe();
  }, [router]);


  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      router.push(PATHS.LOGIN);
    } catch (error)
    {
      const authError = error as AuthError;
      console.error("Error signing out:", authError);
      console.error("Sign-Out Error Code:", authError.code);
      console.error("Sign-Out Error Message:", authError.message);
      // Handle error
    } finally {
      // setLoading(false); // onAuthStateChanged will set loading to false
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
