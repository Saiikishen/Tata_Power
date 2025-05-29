'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { PATHS } from '@/lib/constants';
import { Spinner } from '@/components/shared/Spinner';
import { SolarViewLogo } from '@/components/icons/SolarViewLogo';
import { UserNav } from './UserNav';
import { NavLinks } from './NavLinks';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar'; // Using shadcn sidebar
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(PATHS.LOGIN);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <SidebarHeader className="p-4 flex items-center justify-between">
            <SolarViewLogo className="h-8 w-auto group-data-[collapsible=icon]:hidden" />
             {/* Trigger is better placed in header for mobile, or here for desktop collapsed state handling */}
          </SidebarHeader>
          <SidebarContent className="p-2">
            <NavLinks />
          </SidebarContent>
          <SidebarFooter className="p-2 mt-auto">
            {/* Optional: Add footer content to sidebar */}
          </SidebarFooter>
        </Sidebar>
      
        <div className="flex flex-col flex-1 min-h-screen">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden" /> {/* Mobile sidebar toggle */}
              <SolarViewLogo className="h-7 w-auto hidden md:block lg:hidden group-data-[state=expanded]:md:hidden group-data-[state=collapsed]:md:block" />
              {/* App Name or Breadcrumbs can go here */}
            </div>
            <UserNav />
          </header>
          <SidebarInset> {/* This handles the main content area padding/margin based on sidebar state */}
            <main className="flex-1 p-4 sm:p-6 md:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
