'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

export function GoogleSignInButton({ disabled }: { disabled?: boolean}) {
  const { signInWithGoogle } = useAuth();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    startTransition(async () => {
      try {
        await signInWithGoogle();
        // Successful sign-in is handled by AuthProvider's onAuthStateChanged
        // It will redirect or update UI accordingly.
        // We can show a toast here if needed, but usually better handled globally or by AuthProvider.
        toast({ title: "Signed in with Google successfully!"});
        router.push(PATHS.DASHBOARD); // Redirect after successful Google sign-in
      } catch (error) {
        console.error("Google Sign-In Error:", error);
        toast({ title: "Google Sign-In Failed", description: "Could not sign in with Google. Please try again.", variant: 'destructive' });
      }
    });
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={handleGoogleSignIn}
      disabled={disabled || isPending}
    >
      {isPending ? (
        'Signing in...'
      ) : (
        // Using a simple SVG for Google logo is against guidelines (no non-textual code)
        // Using text instead as per guidelines.
        'Sign in with Google'
      )}
    </Button>
  );
}
