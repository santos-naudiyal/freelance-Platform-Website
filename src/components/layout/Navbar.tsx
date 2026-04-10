"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { LayoutDashboard, User, LogOut, Bell, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { user, logout, isInitialized, isLoading } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthReady = isInitialized && !isLoading;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const dashboardHref = user?.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard';
  const profileHref = user?.role === 'client' ? '/client/settings' : '/freelancer/settings';

  const navLinks = [
    { name: 'Home', href: isAuthReady && user ? dashboardHref : '/' },
    { name: 'Projects', href: '/projects/browse' },
    { name: 'Explore', href: '/freelancers/discover' },
    { name: 'Messages', href: '/messages' },
    { name: 'Settings', href: isAuthReady && user ? profileHref : '/auth/login' },
  ];

  return (
    <>
      <header className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-1rem)] sm:w-[94%] max-w-7xl premium-glass rounded-[1.75rem] sm:rounded-[2rem] border border-white/20 shadow-2xl dark:border-slate-800/50 transition-all duration-500 overflow-hidden">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex h-[4.25rem] sm:h-[4.5rem] items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3 sm:gap-6 xl:gap-10">
              {/* Mobile Menu Toggle */}
              <button 
                className="xl:hidden p-2.5 -ml-1 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-white bg-slate-100/50 dark:bg-slate-800/50 rounded-xl transition-all shrink-0"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={22} />
              </button>

              <Link href={isAuthReady && user ? dashboardHref : "/"} className="flex min-w-0 items-center gap-2 sm:gap-3 group">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0">
                  <LayoutDashboard size={18} className="text-white sm:h-5 sm:w-5" />
                </div>
                <span className="truncate text-lg sm:text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  FreelanceHub<span className="text-primary-600">.</span>
                </span>
              </Link>
              
              <nav className="hidden xl:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className="text-sm font-black text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-white transition-all tracking-tight uppercase tracking-[0.1em]"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
              {!isAuthReady ? (
                <div className="hidden h-11 w-40 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 sm:block" />
              ) : user ? (
                <>
                  <Link href="/notifications" className="relative hidden sm:block">
                    <button className="h-11 w-11 rounded-2xl border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:border-primary-500/30 transition-all group">
                      <Bell size={20} className="group-hover:shake transition-transform" />
                      <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary-500 border-2 border-white dark:border-slate-950 shadow-sm" />
                    </button>
                  </Link>
                  <Link href={dashboardHref} className="hidden sm:block">
                    <Button variant="ghost" size="md" className="rounded-2xl">
                      <User size={18} />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="secondary" 
                    size="md" 
                    onClick={handleLogout}
                    className="rounded-2xl border-rose-100 px-3 sm:px-5 dark:border-rose-900/30 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="hidden sm:block">
                    <Button variant="ghost" size="md" className="rounded-2xl">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="md" className="rounded-2xl px-4 sm:px-8 text-xs sm:text-sm">
                      <span className="hidden sm:inline">Join Platform</span>
                      <span className="sm:hidden">Join</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] xl:hidden bg-slate-950/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-[88%] max-w-sm bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800/50">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  FreelanceHub<span className="text-primary-600">.</span>
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 text-slate-400 hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-xl transition-all group"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 sm:py-8 px-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-5 sm:px-6 py-4 text-base sm:text-lg font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all uppercase tracking-widest"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="p-6 sm:p-8 border-t border-slate-50 dark:border-slate-800/50 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" size="md" className="w-full rounded-2xl">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="md" className="w-full rounded-2xl">
                      Join Platform
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
