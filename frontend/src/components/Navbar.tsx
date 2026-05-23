'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Heart,
  Home,
  Settings,
  Stethoscope,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useDashboard } from '@/hooks/useDashboard';

interface NavTab {
  href: string;
  label: string;
  mobileLabel: string;
  icon: typeof Home;
}

const NAV_TABS: NavTab[] = [
  { href: '/', label: 'Home', mobileLabel: 'Home', icon: Home },
  { href: '/tracking', label: 'Tracking', mobileLabel: 'Track', icon: Heart },
  {
    href: '/health-report',
    label: 'Health Report',
    mobileLabel: 'Report',
    icon: Stethoscope,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const { data } = useDashboard();

  const userName = data?.user.name ?? 'Guest';
  const userAvatar =
    data?.user.avatar ??
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop';

  const isActive = (href: string): boolean => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={userAvatar}
                alt={userName}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Good Morning ✨</p>
              <p className="text-sm font-semibold text-text-primary">{userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full p-2 text-text-secondary hover:bg-primary-bg"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-text-secondary hover:bg-primary-bg"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <header className="sticky top-0 z-50 hidden border-b border-gray-100 bg-white lg:block">
        <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full">
              <Image
                src={userAvatar}
                alt={userName}
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Good Morning ✨</p>
              <p className="text-sm font-semibold text-text-primary">{userName}</p>
            </div>
          </div>

          <ul className="flex items-center gap-2">
            {NAV_TABS.map((tab) => {
              const active = isActive(tab.href);
              const Icon = tab.icon;
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-sm font-medium transition-colors duration-150 active:scale-95',
                      active
                        ? 'bg-primary text-white'
                        : 'border border-gray-200 bg-white text-text-secondary hover:border-primary/30',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full p-2 text-text-secondary hover:bg-primary-bg"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-text-secondary hover:bg-primary-bg"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white px-2 pb-[env(safe-area-inset-bottom,0px)] pt-2 lg:hidden">
        <ul className="flex items-stretch justify-between gap-1">
          {NAV_TABS.map((tab) => {
            const active = isActive(tab.href);
            const Icon = tab.icon;
            return (
              <li key={tab.href} className="min-w-0 flex-1">
                <Link
                  href={tab.href}
                  className={cn(
                    'flex min-w-0 flex-col items-center gap-0.5 rounded-pill px-2 py-2 transition-colors duration-150 active:scale-95',
                    active ? 'bg-primary text-white' : 'text-text-secondary',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="w-full truncate text-center text-[10px] font-medium">
                    {tab.mobileLabel}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
