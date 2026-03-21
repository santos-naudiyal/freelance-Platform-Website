import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { TaskBoard } from '@/components/workspace/TaskBoard';
import { Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default async function TasksPage({ 
  params 
}: { 
  params: Promise<{ project: string }> 
}) {
  const { project } = await params;

  return (
    <WorkspaceLayout projectSlug={project}>
      <div className="space-y-8 h-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              Project Tasks
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Manage and track your project execution phase.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium w-64 focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              />
            </div>
            <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition-all">
              <Filter size={20} />
            </button>
            <Button size="sm" className="h-[2.75rem] px-5 rounded-xl font-bold bg-primary-600 shadow-lg shadow-primary-500/20">
              <Plus size={18} className="mr-2" />
              New Task
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <TaskBoard workspaceId={project} />
        </div>
      </div>
    </WorkspaceLayout>
  );
}
