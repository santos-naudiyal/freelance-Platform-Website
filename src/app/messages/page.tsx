"use client";

import React, { useState } from 'react';
import { ProtectedRoute } from '../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ChatSidebar } from '../../components/chat/ChatSidebar';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { useAuthStore } from '../../store/useAuthStore';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  DollarSign, 
  Settings,
  PlusSquare,
  ClipboardList,
  Search,
  CreditCard,
  CheckCircle2
} from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);

  const freelancerSidebar = [
    { name: 'Dashboard', href: '/freelancer/dashboard', icon: LayoutDashboard },
    { name: 'Browse Projects', href: '/projects/browse', icon: Briefcase },
    { name: 'My Proposals', href: '/freelancer/proposals', icon: FileText },
    { name: 'Active Projects', href: '/freelancer/projects', icon: CheckCircle2 },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Earnings', href: '/freelancer/earnings', icon: DollarSign },
    { name: 'Settings', href: '/freelancer/settings', icon: Settings },
  ];

  const clientSidebar = [
    { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Post a Project', href: '/create-project', icon: PlusSquare },
    { name: 'Manage Projects', href: '/client/manage-projects', icon: ClipboardList },
    { name: 'Find Freelancers', href: '/freelancers/discover', icon: Search },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Payments', href: '/client/payments', icon: CreditCard },
    { name: 'Settings', href: '/client/settings', icon: Settings },
  ];

  const sidebarItems = user?.role === 'client' ? clientSidebar : freelancerSidebar;

  // Real-time conversations fetch
  React.useEffect(() => {
    if (!user?.id) return;

    const q = query(
      collection(db, 'Chats'),
      where('participants', 'array-contains', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Map otherUser data for the sidebar
        otherUser: (doc.data().participantDetails || []).find((p: any) => p.id !== user.id) || { name: 'User' }
      }));

      // Client-side sort by updatedAt descending
      chats.sort((a: any, b: any) => {
        const timeA = a.updatedAt?.seconds || 0;
        const timeB = b.updatedAt?.seconds || 0;
        return timeB - timeA;
      });

      setConversations(chats);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const activeChat = conversations.find(c => c.id === activeChatId);

  return (
    <ProtectedRoute>
      <DashboardLayout sidebarItems={sidebarItems} title="Inbox">
        <div className="flex bg-white dark:bg-slate-900/50 rounded-[2.5rem] shadow-premium ring-1 ring-slate-200/50 dark:ring-slate-800/50 overflow-hidden h-[calc(100vh-12rem)] min-h-[600px]">
          <ChatSidebar 
            conversations={conversations} 
            activeId={activeChatId} 
            onSelect={setActiveChatId} 
          />
          <main className="flex-1 flex flex-col h-full overflow-hidden">
            <ChatWindow 
              chatId={activeChatId || ''} 
              currentUserId={user?.id || ''} 
              otherUser={activeChat?.otherUser}
            />
          </main>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
