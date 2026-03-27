import React from 'react';
import { WorkspaceLayout } from '@/components/workspace/WorkspaceLayout';
import { Payments } from '@/components/workspace/Payments';

export default async function PaymentsPage({ 
  params 
}: { 
  params: Promise<{ project: string }> 
}) {
  const { project } = await params;

  return (
    <WorkspaceLayout projectSlug={project}>
      <Payments workspaceId={project} />
    </WorkspaceLayout>
  );
}
