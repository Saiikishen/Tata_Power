'use client';

import AppShell from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, UserCircle2, Bell, Palette } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  return (
    <AppShell>
      <PageHeader 
        title="Settings"
        description="Manage your account and application preferences."
      />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1"> {/* Max width for content area can be set on a parent if needed */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <UserCircle2 className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-xl">Account Information</CardTitle>
                <CardDescription>View and manage your personal details.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-md text-foreground">{user?.displayName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-md text-foreground">{user?.email || 'N/A'}</p>
            </div>
            <Separator className="my-4" />
             <Button variant="destructive" onClick={signOut} className="w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
           <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-xl">Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive alerts.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Notification settings are not yet available.</p>
            {/* Placeholder for notification settings */}
          </CardContent>
        </Card>

         <Card className="shadow-lg">
           <CardHeader>
            <div className="flex items-center gap-3">
              <Palette className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-xl">Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the app.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Theme customization is not yet available.</p>
            {/* Placeholder for theme settings */}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
