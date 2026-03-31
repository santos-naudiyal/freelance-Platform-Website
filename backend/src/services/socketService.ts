import { Server } from 'socket.io';

let io: Server | null = null;

export const initSocket = (server: any) => {
  console.log("🚀 Initializing Socket.IO...");

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on('join-project-chat', (projectId: string) => {
      console.log(`📥 Socket ${socket.id} joined project chat ${projectId}`);
      socket.join(projectId);
    });

    socket.on('disconnect', () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    console.error("❌ Socket.io not initialized!");
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const emitToProjectChat = (
  projectId: string,
  event: string,
  data: any
) => {
  if (!io) {
    console.warn("⚠️ emit-chat failed: socket not initialized");
    return;
  }

  console.log(`📡 Emitting ${event} to project chat ${projectId}`);

  try {
    io.to(projectId).emit(event, data);
  } catch (err) {
    console.error("❌ Chat Emit error:", err);
  }
};

export const emitTaskUpdate = (projectId: string, task: any) => {
  emitToProjectChat(projectId, 'task-updated', task);
};

export const emitMilestoneUpdate = (projectId: string, milestone: any) => {
  emitToProjectChat(projectId, 'milestone-updated', milestone);
};