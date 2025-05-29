
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LineChart, Settings as SettingsIcon, HardDriveUpload } from 'lucide-react'; // Added HardDriveUpload
import { PATHS } from '@/lib/constants';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navItems = [
  { href: PATHS.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: PATHS.HISTORY, label: 'History', icon: LineChart },
  { href: PATHS.DEVICE_FILES, label: 'Device Files', icon: HardDriveUpload }, // Added Device Files link
  { href: PATHS.SETTINGS, label: 'Settings', icon: SettingsIcon },
];

export function NavLinks() {
  const pathname = usePathname();
  const { open } = useSidebar(); // from shadcn/ui/sidebar context

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href}
              className={cn("w-full justify-start", !open && "justify-center")}
              tooltip={{ children: item.label, className: "capitalize" }}
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={cn(open ? "opacity-100" : "opacity-0 hidden md:opacity-100 group-data-[collapsible=icon]:md:hidden", "transition-opacity duration-200")}>
                {item.label}
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
