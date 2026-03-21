"use client";

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';

export function useTasks(workspaceId: string) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaceId || !isInitialized || !isAuthenticated) return;

    const q = query(
      collection(db, 'workspaces', workspaceId, 'tasks')
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
  }, [workspaceId]);

  const updateTaskStatus = async (taskId: string, status: Task['status']) => {
    try {
      const taskRef = doc(db, 'workspaces', workspaceId, 'tasks', taskId);
      await updateDoc(taskRef, { status });
    } catch (err) {
      console.error('Update task status error:', err);
      throw new Error('Failed to update task.');
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'workspaces', workspaceId, 'tasks'), {
        ...task,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Add task error:', err);
      throw new Error('Failed to add task.');
    }
  };

  return { tasks, loading, error, updateTaskStatus, addTask };
}
