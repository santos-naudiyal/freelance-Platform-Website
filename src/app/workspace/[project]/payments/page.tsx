import { redirect } from 'next/navigation';

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  redirect(`/workspace/${project}`);
}
