'use client';

import { AuthForm } from '@/components/auth/AuthForm';
import { SolarViewLogo } from '@/components/icons/SolarViewLogo';
import { PATHS } from '@/lib/constants';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button'; // Added import

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(PATHS.DASHBOARD);
    }
  }, [user, loading, router]);

   if (loading || user) {
     return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="items-center text-center space-y-2">
          <Link href={PATHS.HOME} aria-label="Go to homepage">
            <SolarViewLogo className="h-12 w-auto" />
          </Link>
          <CardTitle className="text-2xl font-semibold">Create Your SolarView Account</CardTitle>
          <CardDescription>Join us and start monitoring your solar energy.</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" asChild className="px-1 text-primary">
              <Link href={PATHS.LOGIN}>Log In</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
