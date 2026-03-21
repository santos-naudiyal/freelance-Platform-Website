import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { 
  FileText, 
  Image as ImageIcon, 
  Zap, 
  MoreVertical, 
  Upload,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function FilesPage({ 
  params 
}: { 
  params: Promise<{ project: string }> 
}) {
  const { project } = await params;

  return (
    <WorkspaceLayout projectSlug={project}>
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
              Project Infrastructure
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Manage assets, code snippets, and documentation.
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Upload size={18} />
            Upload Asset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: 'Architecture-Final.pdf', type: 'PDF', size: '2.4 MB', date: 'Mar 12', icon: FileText, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20' },
            { name: 'Landing-Page-Design.fig', type: 'FIGMA', size: '15.8 MB', date: 'Mar 10', icon: ImageIcon, color: 'text-primary-500 bg-primary-50 dark:bg-primary-950/20' },
            { name: 'API-Integration-Hooks.ts', type: 'CODE', size: '45 KB', date: 'Mar 14', icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
            { name: 'Project-Brief.docx', type: 'DOCX', size: '1.2 MB', date: 'Mar 02', icon: FileText, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
          ].map((file) => (
            <div key={file.name} className="premium-card p-5 group">
              <div className="flex justify-between items-start mb-6">
                <div className={cn("p-3 rounded-2xl", file.color)}>
                  <file.icon size={24} />
                </div>
                <button className="p-1 px-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 truncate group-hover:text-primary-600 transition-colors">
                {file.name}
              </h4>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>{file.size}</span>
                <span>{file.date}</span>
              </div>
            </div>
          ))}
          
          {/* Empty State / Add Folder Slot */}
          <button className="h-full min-h-[160px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-primary-600 hover:border-primary-500/50 transition-all">
            <FolderOpen size={32} strokeWidth={1.5} />
            <span className="text-xs font-bold">New Directory</span>
          </button>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
