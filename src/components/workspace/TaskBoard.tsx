"use client";

import { Plus, MoreHorizontal, User, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types';
import { Loader } from '@/components/ui/Loader';
import { Skeleton } from '@/components/ui/Skeleton';

interface TaskBoardProps {
  workspaceId: string;
}

export function TaskBoard({ workspaceId }: TaskBoardProps) {
  const { tasks, loading, updateTaskStatus } = useTasks(workspaceId);

  const columnConfig = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'done', title: 'Completed' },
  ];

  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);

  return (
    <div className="flex gap-6 h-[calc(100vh-14rem)] overflow-x-auto pb-4 scrollbar-hide">
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
           <Loader size="xl" withText />
           <div className="mt-12 flex gap-6 w-full overflow-hidden opacity-50 pointer-events-none">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex-shrink-0 w-80 space-y-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ))}
           </div>
        </div>
      ) : (
        columnConfig.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div key={column.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                    {column.title}
                  </h3>
                  <span className="h-5 min-w-[1.25rem] px-1.5 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500">
                    {columnTasks.length}
                  </span>
                </div>
                <button className="p-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                  <Plus size={16} />
                </button>
              </div>

              <div 
                className="flex-1 space-y-3 p-1 overflow-y-auto scrollbar-hide min-h-[150px] rounded-2xl border-2 border-transparent transition-all"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-primary-500/20', 'bg-primary-50/5');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('border-primary-500/20', 'bg-primary-50/5');
                }}
                onDrop={(e) => {
                  e.currentTarget.classList.remove('border-primary-500/20', 'bg-primary-50/5');
                  const taskId = e.dataTransfer.getData('taskId');
                  if (taskId) updateTaskStatus(taskId, column.id as Task['status']);
                }}
              >
                {columnTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="premium-card p-5 cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-primary-500/20 group relative z-10"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                        task.priority === 'urgent' || task.priority === 'high' ? "bg-rose-100 text-rose-600 dark:bg-rose-950/30" :
                        task.priority === 'medium' ? "bg-amber-100 text-amber-600 dark:bg-amber-950/30" :
                        "bg-slate-100 text-slate-600 dark:bg-slate-800"
                      )}>
                        {task.priority || 'NORMAL'}
                      </span>
                      <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 line-clamp-2 leading-tight">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-[10px] text-slate-500 mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigneeId || 'Team'}`} 
                          className="h-6 w-6 rounded-lg bg-slate-100 dark:bg-slate-800"
                          alt="assignee"
                        />
                        <span className="text-[10px] font-bold text-slate-500">Expert</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'No date'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Add Column Button */}
      <button className="flex-shrink-0 w-80 h-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:text-primary-600 hover:border-primary-500/50 transition-all font-bold text-sm">
        <Plus size={18} />
        Add Section
      </button>
    </div>
  );
}
