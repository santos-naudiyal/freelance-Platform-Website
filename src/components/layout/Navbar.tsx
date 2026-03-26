"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { LayoutDashboard, User, LogOut, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export function Navbar() {
  const { user, setUser, setFreelancerDetails } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFreelancerDetails(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const dashboardHref = user?.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard';
  const profileHref = user?.role === 'client' ? '/client/settings' : '/freelancer/profile';

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl premium-glass rounded-[2rem] border border-white/20 shadow-2xl dark:border-slate-700/50 transition-all duration-500">
      <div className="px-6 sm:px-8 lg:px-10">
        <div className="flex h-[4.5rem] items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href={user ? dashboardHref : "/"} className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                <LayoutDashboard size={22} className="text-white" />
              </div>
              <span className="text-2xl font-display font-black tracking-tight text-slate-950 dark:text-white">
                Freelace<span className="text-primary-600">.</span>
              </span>
            </Link>
            
            <nav className="hidden xl:flex items-center gap-10">
              {[
                { name: 'Home', href: user ? dashboardHref : '/' },
                { name: 'Projects', href: '/projects/browse' },
                { name: 'Explore', href: '/freelancers/discover' },
                { name: 'Messages', href: '/messages' },
                { name: 'Profile', href: user ? profileHref : '/auth/login' },
              ].map((link) => (
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

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link href="/notifications" className="relative">
                  <button className="h-11 w-11 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-primary-600 hover:border-primary-500/50 transition-all">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-primary-500 border-2 border-white dark:border-slate-950 shadow-sm" />
                  </button>
                </Link>
                <Link href={dashboardHref}>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                    <User size={18} />
                    My Dashboard
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="h-11 px-6 rounded-2xl font-bold border-slate-200 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all gap-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="h-11 px-8 rounded-2xl font-black bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-xl shadow-primary-500/20 hover:scale-105 active:scale-95 transition-all duration-300">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
