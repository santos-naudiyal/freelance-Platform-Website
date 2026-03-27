import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { Chat } from '@/components/workspace/Chat';

export default async function MessagesPage({ 
  params 
}: { 
  params: Promise<{ project: string }> 
}) {
  const { project } = await params;

  return (
    <WorkspaceLayout projectSlug={project}>
      <div className="h-[calc(100vh-14rem)]">
        <Chat workspaceId={project} />
      </div>
    </WorkspaceLayout>
  );
}
