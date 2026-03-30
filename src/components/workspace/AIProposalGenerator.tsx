import React, { useState } from 'react';
import { Sparkles, Loader2, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { apiClient } from '../../lib/api/client';
import { toast } from 'react-hot-toast';

interface AIProposalGeneratorProps {
  projectId: string;
  onGenerated: (data: { coverLetter: string, suggestedRate: number, estimatedDuration: string, reasoning: string }) => void;
}

export function AIProposalGenerator({ projectId, onGenerated }: AIProposalGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastReasoning, setLastReasoning] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setLastReasoning(null);
      
      const response = await apiClient.post('/ai/draft-proposal', { projectId }) as any;
      
      if (response && response.coverLetter) {
        onGenerated(response);
        setLastReasoning(response.reasoning);
        toast.success('Proposal drafted successfully!');
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error: any) {
      console.error('AI Draft Error:', error);
      toast.error(error?.message || 'Failed to draft proposal. Make sure your profile is complete.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 dark:border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Copilot Draft</h4>
            <p className="text-[11px] text-slate-500 font-medium">Auto-write a compelling proposal based on your skills</p>
          </div>
        </div>
        
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          variant="outline"
          className="w-full sm:w-auto h-10 rounded-xl bg-white dark:bg-slate-900 border-purple-500/30 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-500/50 shadow-sm"
        >
          {isGenerating ? (
             <><Loader2 size={16} className="mr-2 animate-spin" /> Drafting...</>
          ) : (
             <><Zap size={16} className="mr-2" /> Draft with AI</>
          )}
        </Button>
      </div>

      {lastReasoning && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/30">
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">AI Reasoning</p>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">{lastReasoning}</p>
        </div>
      )}
    </div>
  );
}
