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
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    { name: 'Home', href: user ? dashboardHref : '/' },
    { name: 'Projects', href: '/projects/browse' },
    { name: 'Explore', href: '/freelancers/discover' },
    { name: 'Messages', href: '/messages' },
    { name: 'Settings', href: user ? profileHref : '/auth/login' },
  ];

  return (
    <>
      <header className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl premium-glass rounded-2xl sm:rounded-[2rem] border border-white/20 shadow-2xl dark:border-slate-700/50 transition-all duration-500">
        <div className="px-4 sm:px-6 lg:px-10">
          <div className="flex h-[4rem] sm:h-[4.5rem] items-center justify-between">
            <div className="flex items-center gap-6 xl:gap-10">
              {/* Mobile Menu Toggle */}
              <button 
                className="xl:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>

              <Link href={user ? dashboardHref : "/"} className="flex items-center gap-2 group">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                  <LayoutDashboard size={18} className="text-white sm:h-[22px] sm:w-[22px]" />
                </div>
                <span className="text-xl sm:text-2xl font-display font-black tracking-tight text-slate-950 dark:text-white">
                  Freelace<span className="text-primary-600">.</span>
                </span>
              </Link>
              
              <nav className="hidden xl:flex items-center gap-10">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className="text-sm font-bold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-white transition-colors tracking-tight"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
              {user ? (
                <>
                  <Link href="/notifications" className="relative hidden sm:block">
                    <button className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:border-primary-500/50 transition-all">
                      <Bell size={18} className="sm:h-5 sm:w-5" />
                      <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-primary-500 border-2 border-white dark:border-slate-950 shadow-sm" />
                    </button>
                  </Link>
                  <Link href={dashboardHref} className="hidden sm:block">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                      <User size={18} />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="h-9 px-4 sm:h-11 sm:px-6 rounded-xl sm:rounded-2xl font-bold border-slate-200 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all gap-2"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="hidden sm:block">
                    <Button variant="ghost" size="sm" className="font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="h-9 px-5 sm:h-11 sm:px-8 rounded-xl sm:rounded-2xl text-sm sm:text-base font-black bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-xl shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all duration-300">
                      Join
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
            className="fixed inset-0 z-[60] xl:hidden bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <span className="text-2xl font-display font-black tracking-tight text-slate-950 dark:text-white">
                  Freelace<span className="text-primary-600">.</span>
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-lg font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-12 rounded-xl text-base font-bold">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full h-12 rounded-xl text-base font-black bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-xl shadow-primary-500/20">
                      Join Now
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
