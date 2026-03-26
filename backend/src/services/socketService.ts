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

    socket.on('join-workspace', (workspaceId: string) => {
      console.log(`📥 Socket ${socket.id} joined workspace ${workspaceId}`);
      socket.join(workspaceId);
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

export const emitToWorkspace = (
  workspaceId: string,
  event: string,
  data: any
) => {
  if (!io) {
    console.warn("⚠️ emit failed: socket not initialized");
    return;
  }

  console.log(`📡 Emitting ${event} to workspace ${workspaceId}`);

  try {
    io.to(workspaceId).emit(event, data);
  } catch (err) {
    console.error("❌ Emit error:", err);
  }
};

export const emitTaskUpdate = (workspaceId: string, task: any) => {
  emitToWorkspace(workspaceId, 'task-updated', task);
};

export const emitMilestoneUpdate = (workspaceId: string, milestone: any) => {
  emitToWorkspace(workspaceId, 'milestone-updated', milestone);
};