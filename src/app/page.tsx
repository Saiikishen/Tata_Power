
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { PATHS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { SolarViewLogo } from '@/components/icons/SolarViewLogo';
import { Spinner } from '@/components/shared/Spinner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(PATHS.DASHBOARD);
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <Spinner />
      </div>
    );
  }

  if (user) {
    // Should be redirected, but as a fallback:
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <p>Redirecting to dashboard...</p>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="items-center text-center">
          <SolarViewLogo className="h-12 w-auto mb-4" />
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome to SolarView</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Monitor your solar energy production with ease.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src="https://firebasestudio-hosting.web.app/images/gallery/Tata-Power/f7777a10-ac24-405c-b1d4-2b5321b98862.jpg"
              alt="Solar technician inspecting panels"
              width={600}
              height={400} // Adjusted height to better match aspect ratio of new image
              className="object-cover"
              data-ai-hint="solar technician"
              priority
            />
          </div>
          <p className="text-center text-foreground">
            Gain insights into your solar panel performance, track historical data, and optimize your energy usage.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="w-full sm:w-auto flex-1" size="lg">
            <Link href={PATHS.LOGIN}>Log In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto flex-1" size="lg">
            <Link href={PATHS.SIGNUP}>Sign Up</Link>
          </Button>
        </CardFooter>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SolarView. Shine Bright.</p>
      </footer>
    </div>
  );
}
