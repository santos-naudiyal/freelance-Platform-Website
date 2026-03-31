import React from 'react';
import { LayoutDashboard, Twitter, Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-white/5 pt-12 pb-8 lg:pt-20 lg:pb-10">
      <div className="container mx-auto px-6 sm:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5 lg:gap-16">
          <div className="md:col-span-2 lg:col-span-2 space-y-6 lg:space-y-8">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <LayoutDashboard size={22} className="text-white" />
              </div>
              <span className="text-2xl font-display font-black tracking-tight">
                Freelace<span className="text-primary-600">.</span>
              </span>
            </div>
            <p className="text-base lg:text-lg text-slate-400 max-w-sm leading-relaxed font-medium">
              The world's first Work Operating System. Scale your vision with elite experts and automated project workspaces.
            </p>
            <div className="flex items-center gap-6">
               <Twitter size={20} className="text-slate-500 hover:text-white transition-colors cursor-pointer" />
               <Github size={20} className="text-slate-500 hover:text-white transition-colors cursor-pointer" />
               <Linkedin size={20} className="text-slate-500 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xs lg:text-sm font-black text-white uppercase tracking-[0.2em] mb-6 lg:mb-8">Platform</h3>
            <ul className="space-y-4">
              <li><a href="/" className="text-slate-400 hover:text-white transition-colors font-medium">Home</a></li>
              <li><a href="/freelancers/discover" className="text-slate-400 hover:text-white transition-colors font-medium">Explore Experts</a></li>
              <li><a href="/workspaces" className="text-slate-400 hover:text-white transition-colors font-medium">Workspaces</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs lg:text-sm font-black text-white uppercase tracking-[0.2em] mb-6 lg:mb-8">Community</h3>
            <ul className="space-y-4">
              <li><a href="/community" className="text-slate-400 hover:text-white transition-colors font-medium">Forums</a></li>
              <li><a href="/community/share" className="text-slate-400 hover:text-white transition-colors font-medium">Share Work</a></li>
              <li><a href="/learn" className="text-slate-400 hover:text-white transition-colors font-medium">Learning Hub</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs lg:text-sm font-black text-white uppercase tracking-[0.2em] mb-6 lg:mb-8">Resources</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Developer API</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Trust & Safety</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-medium">Help Center</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 lg:mt-20 pt-8 lg:pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p className="text-xs lg:text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Freelace. The Work OS for the elite global workforce.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-8 text-xs lg:text-sm text-slate-500 font-medium">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
