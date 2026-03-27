"use client";

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc,
  addDoc,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { callBackend } from '@/lib/api';

export function useTasks(workspaceId: string) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId || !isInitialized || !isAuthenticated) return;

    const q = query(
      collection(db, 'Tasks'),
      where('projectId', '==', workspaceId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(taskList);
      setLoading(false);
    }, (err) => {
      console.error('Task sync error:', err);
      setError('Failed to sync tasks.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [workspaceId, isInitialized, isAuthenticated]);

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      await callBackend(`workspaces/tasks/${taskId}`, 'PATCH', {
        status,
        projectId: workspaceId
      });
    } catch (err) {
      console.error('Update task status error:', err);
      throw new Error('Failed to update task.');
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      await callBackend('workspaces/tasks', 'POST', {
        ...task,
        projectId: workspaceId
      });
    } catch (err) {
      console.error('Add task error:', err);
      throw new Error('Failed to add task.');
    }
  };

  return { tasks, loading, error, updateTaskStatus, addTask };
}
