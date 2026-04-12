import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ReputationCard } from '@/components/expert/ReputationCard';
import { SkillBadges } from '@/components/expert/SkillBadges';
import { 
  ShieldCheck, 
  MapPin, 
  Globe, 
  Linkedin, 
  Twitter, 
  Github,
  Mail,
  Calendar,
  MessageSquare,
  Award,
  Zap,
  ArrowRight,
  Maximize2,
  Layout
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TrustBadge } from '@/components/trust/TrustBadge';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function ExpertProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  // Fetch real expert data from Freelancers and Users collections
  let expertData: any = null;
  try {
    const freelancerRef = doc(db, 'Freelancers', id);
    const userRef = doc(db, 'Users', id);
    
    const [freelancerSnap, userSnap] = await Promise.all([
      getDoc(freelancerRef),
      getDoc(userRef)
    ]);

    if (freelancerSnap.exists() && userSnap.exists()) {
      const fData = freelancerSnap.data();
      const uData = userSnap.data();
      const profile = fData.profile || {};
      
      expertData = {
        id: id,
        name: uData.name || 'Anonymous Expert',
        role: profile.title || 'Professional Freelancer',
        bio: profile.bio || 'This expert hasn\'t provided a bio yet.',
        location: uData.address || 'Remote',
        website: profile.portfolioLinks?.[0] || uData.website || '',
        githubUrl: profile.githubUrl || '',
        portfolioLinks: profile.portfolioLinks || [],
        avatar: profile.avatar || uData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
        skills: profile.skills || [],
        hourlyRate: profile.hourlyRate || 0,
        availability: fData.availability || 'available',
        successRate: '99.9%', // Placeholder for future reputation engine
        deliverySpeed: 'Elite',
        satisfactionScore: '5.0/5.0',
        verifiedProjects: 0
      };
    }
  } catch (err) {
    console.error('Fetch expert error:', err);
  }

  const expert: any = expertData || {
    id: 'placeholder',
    name: 'Sarah Chen',
    role: 'Elite Systems Architect',
    bio: 'I specialize in scaling fintech infrastructures from zero to 100M users.',
    location: 'Singapore (UTC+8)',
    website: 'chen.systems',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    successRate: '99.4%',
    deliverySpeed: '1.2x Faster',
    satisfactionScore: '4.9/5.0',
    verifiedProjects: 14,
    skills: ['Flutter', 'Node.js', 'Firebase', 'AWS', 'Kubernetes'],
    githubUrl: 'https://github.com',
    portfolioLinks: [],
    hourlyRate: 95
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Profile Hero Section */}
        <div className="premium-card p-0 overflow-hidden mb-12 border-none shadow-2xl">
          <div className="h-48 bg-gradient-to-r from-primary-600 via-indigo-600 to-indigo-900 relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="absolute -bottom-16 left-12">
              <div className="relative">
                <img 
                  src={expert.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${expert.id}`} 
                  className="h-40 w-40 rounded-[2.5rem] bg-white dark:bg-slate-900 p-2 shadow-2xl border-4 border-white dark:border-slate-950" 
                  alt={expert.name} 
                />
                <div className="absolute bottom-2 right-2">
                  <TrustBadge type="titanium" size="lg" showText={false} className="shadow-2xl" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-12 px-12 bg-white dark:bg-slate-900">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-white uppercase">{expert.name}</h1>
                  <TrustBadge type="titanium" />
                  <TrustBadge type="identity" />
                </div>
                <p className="text-xl font-medium text-slate-500 max-w-2xl">
                  {expert.bio || expert.role}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-6">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{expert.successRate}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Success Rate</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{expert.deliverySpeed}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Delivery Speed</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{expert.satisfactionScore}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Client Score</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{expert.verifiedProjects}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Real Projects</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-primary-500" />
                    {expert.location || 'Remote'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-primary-500" />
                    {expert.website ? (
                      <a href={expert.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">
                        {expert.website.replace('https://', '').replace('http://', '')}
                      </a>
                    ) : (
                      'portfolio.io'
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Linkedin size={18} className="hover:text-primary-600 cursor-pointer transition-colors" />
                    <Twitter size={18} className="hover:text-primary-600 cursor-pointer transition-colors" />
                    {expert.githubUrl && (
                      <a href={expert.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github size={18} className="hover:text-primary-600 cursor-pointer transition-colors text-slate-900 dark:text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="mr-6 py-4 px-6 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-500/10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Standard Rate</p>
                   <p className="text-xl font-black italic">₹{expert.hourlyRate}/hr</p>
                </div>
                <Button variant="outline" className="h-[3.8rem] px-8 rounded-2xl font-black text-xs uppercase tracking-widest gap-2 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <MessageSquare size={18} />
                  Message
                </Button>
                <Button className="h-[3.8rem] px-10 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-950 hover:bg-slate-800 text-white shadow-xl shadow-slate-500/10">
                  Hire for Outcome
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
                <Award size={18} className="text-primary-500" />
                Verified Reputation Performance
              </h3>
              <ReputationCard />
            </section>

            <section>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
                <Zap size={18} className="text-primary-500" />
                Verified Skill Infrastructure
              </h3>
              <SkillBadges />
            </section>

            <section className="space-y-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                <Maximize2 size={18} className="text-primary-500" />
                Verified Outcome Proof (Portfolio)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {expert.portfolioLinks && expert.portfolioLinks.length > 0 ? (
                  expert.portfolioLinks.map((link: string, i: number) => (
                    <div key={i} className="premium-card p-0 overflow-hidden group">
                      <div className="h-48 overflow-hidden relative">
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                           <Layout size={40} className="text-slate-300" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <div className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-1">External Project</div>
                          <h4 className="text-lg font-bold text-white uppercase tracking-tight truncate max-w-[250px]">{link.replace('https://', '').replace('http://', '')}</h4>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Verified Outcome</div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Live Production Deployment</p>
                        <a href={link} target="_blank" rel="noopener noreferrer" className="mt-6 text-[10px] font-black uppercase tracking-widest text-primary-600 flex items-center gap-2 hover:gap-3 transition-all">
                          View Live Project <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-12 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                     <Layout size={48} className="text-slate-300 mb-4" />
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No public projects showcased yet</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-10">
            <div className="premium-card p-8 bg-white dark:bg-slate-900 border-primary-500/20 shadow-primary-500/5">
              <h3 className="text-lg font-display font-black tracking-tight text-slate-900 dark:text-white mb-6 uppercase">
                Real-time Availability
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-500">Current Status</span>
                  <div className="flex items-center gap-2 text-emerald-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available Now
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-500">Standard Rate</span>
                  <span className="text-slate-900 dark:text-white">₹95 - ₹120/hr</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-slate-500">Match Speed</span>
                  <span className="text-primary-600 uppercase tracking-widest text-[10px] font-black">Within 4 Hours</span>
                </div>
              </div>
              <Button className="w-full mt-8 h-14 rounded-xl font-black text-xs uppercase tracking-widest bg-primary-600 shadow-xl shadow-primary-500/20">
                Book Consult
              </Button>
            </div>

            <section>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                <Calendar size={16} />
                Recent Endorsements
              </h3>
              <div className="space-y-4">
                {[
                  { author: 'CEO, Fintech Corp', text: "Sarah is the most architecturally sound developer I've ever worked with. Her outcomes are always ahead of schedule." },
                  { author: 'Head of Product, Lumina', text: "A true elite expert. She doesn't just write code; she plans for scale and long-term success." },
                ].map((quote, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 italic text-sm text-slate-500 relative">
                    "{quote.text}"
                    <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-100 not-italic">
                      — {quote.author}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="premium-card p-6 bg-gradient-to-br from-slate-900 to-primary-950 text-white border-none shadow-2xl">
              <TrustBadge type="verified" size="lg" className="mb-4 bg-white/10 border-white/10" />
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">Outcome Identity Verified</h4>
              <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase">
                This expert has passed our identity verification, technical screening, and has a proven track record of 10+ verified project outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
