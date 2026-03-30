import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { ActivityFeed } from '@/components/workspace/ActivityFeed';

export default async function ActivityPage({ 
  params 
}: { 
  params: Promise<{ project: string }> 
}) {
  const { project } = await params;

  return (
    <WorkspaceLayout projectSlug={project}>
      <div className="max-w-3xl mx-auto">

      </div>
    </WorkspaceLayout>
  );
}
