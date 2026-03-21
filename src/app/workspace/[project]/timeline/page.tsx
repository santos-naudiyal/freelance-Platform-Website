import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { Timeline } from '@/components/workspace/Timeline';
import { Calendar, Download, Share2 } from 'lucide-react';

export default async function TimelinePage({ 
  params 
}: { 
  params: Promise<{ project: string }> 
}) {
  const { project } = await params;

  return (
    <WorkspaceLayout projectSlug={project}>
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              Project Lifecycle
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Track milestones, phases, and AI-predicted delivery dates.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-bold text-slate-600 dark:text-slate-400 transition-all">
              <Calendar size={18} />
              Sync Calendar
            </button>
            <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary-600 transition-all">
              <Download size={20} />
            </button>
          </div>
        </div>

        <Timeline />
      </div>
    </WorkspaceLayout>
  );
}
