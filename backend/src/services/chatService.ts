import { emitToProjectChat } from './socketService';
import { db } from '../config/firebase';

export interface Message {
  id?: string;
  projectId: string;
  senderId: string;
  senderName: string;
  text: string;
  type: 'user' | 'ai';
  createdAt: number;
}

export class ChatService {

  async sendMessage(messageData: Omit<Message, 'createdAt'>): Promise<Message> {
    try {
      const message: Message = {
        ...messageData,
        createdAt: Date.now()
      };

      const docRef = await db.collection('Messages').add(message);
      message.id = docRef.id;

      console.log("💬 Message saved:", message.id);

      // ✅ emit socket
      emitToProjectChat(message.projectId, 'new-message', message);

      return message;

    } catch (err) {
      console.error("❌ sendMessage failed:", err);

      // fallback message (prevents UI crash)
      return {
        id: 'failed',
        projectId: messageData.projectId,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        text: "Message failed to send",
        type: 'ai',
        createdAt: Date.now()
      };
    }
  }

  async getMessages(projectId: string): Promise<Message[]> {
    try {
      console.log("📥 Fetching messages for:", projectId);

      const snapshot = await db
        .collection('Messages')
        .where('projectId', '==', projectId)
        .orderBy('createdAt', 'asc')
        .get();

      return snapshot.docs.map(doc => {
        const data = doc.data();

        return {
          id: doc.id,
          projectId: data.projectId,
          senderId: data.senderId,
          senderName: data.senderName,
          text: data.text,
          type: data.type,
          createdAt: data.createdAt
        } as Message;
      });

    } catch (err) {
      console.error("❌ getMessages failed:", err);
      return [];
    }
  }
}