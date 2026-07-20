'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  const isLoginPage = pathname === '/login';

  // Fetch current user and new leads count
  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    async function checkAuthAndStats() {
      try {
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) {
          router.push('/login');
          return;
        }
        const userData = await userRes.json();
        setUser(userData.user);

        // Fetch leads count of NEW status leads
        const leadsRes = await fetch('/api/leads/stats');
        if (leadsRes.ok) {
          const stats = await leadsRes.json();
          setNewLeadsCount(stats.newLeadsCount || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndStats();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-cloud text-navy">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy border-t-transparent mx-auto"></div>
          <p className="mt-4 font-semibold font-body">Loading Admin Session...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const sidebarLinks = [
    { name: 'Dashboard Overview', href: '/', icon: 'home' },
    { name: 'Leads Triage', href: '/leads', icon: 'users', badge: newLeadsCount },
    { name: 'Manage Services', href: '/services', icon: 'briefcase' },
    { name: 'Manage Users', href: '/users', icon: 'user-group', adminOnly: true },
    { name: 'Reports', href: '/reports', icon: 'document-report' },
    { name: 'Settings', href: '/settings', icon: 'cog' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-cloud text-charcoal">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-navy-dark text-white">
        <div className="flex h-20 items-center px-6 border-b border-white/10">
          <span className="text-xl font-bold font-heading">CONSULTax Admin</span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {sidebarLinks.map((link) => {
            if (link.adminOnly && user?.role !== 'SUPER_ADMIN') return null;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange text-white'
                    : 'text-white/70 hover:bg-navy hover:text-white'
                }`}
              >
                <span className="font-heading">{link.name}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="rounded-full bg-orange px-2 py-0.5 text-xs text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold border border-white/20 hover:bg-orange hover:border-orange transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-rule bg-white px-6">
          <h2 className="text-xl font-bold text-navy font-heading">
            {sidebarLinks.find((l) => l.href === pathname)?.name || 'Admin Panel'}
          </h2>
          <div className="flex items-center gap-4">
            {/* Notification Toast Trigger Area */}
            {newLeadsCount > 0 && (
              <div className="relative">
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange text-[9px] font-bold text-white animate-pulse">
                  {newLeadsCount}
                </span>
                <svg className="h-6 w-6 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            )}
            
            <div className="h-8 w-px bg-rule" />

            <div className="text-right">
              <p className="text-sm font-bold text-navy font-body">{user?.name}</p>
              <p className="text-xs text-charcoal/60 font-body uppercase tracking-wider font-semibold">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
