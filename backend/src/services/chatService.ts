import { emitToProjectChat, emitNotification } from './socketService';
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

      // ✅ Update project's lastMessageAt for WhatsApp-style sorting
      await db.collection('Projects').doc(message.projectId).update({ 
          lastMessageAt: message.createdAt 
      });

      console.log("💬 Message saved:", message.id);

      // ✅ emit socket
      emitToProjectChat(message.projectId, 'new-message', message);

      // ✅ notify recipient
      try {
          const projectDoc = await db.collection('Projects').doc(message.projectId).get();
          const projectData = projectDoc.data();
          
          if (projectData) {
              let recipientId = null;
              if (message.senderId === projectData.clientId) {
                  // Sender is client -> notify freelancer if accepted
                  const pSnapshot = await db.collection('Proposals')
                      .where('projectId', '==', message.projectId)
                      .where('status', '==', 'accepted')
                      .get();
                  if (!pSnapshot.empty) {
                      recipientId = pSnapshot.docs[0].data().freelancerId;
                  }
              } else {
                  // Sender is freelancer -> notify client
                  recipientId = projectData.clientId;
              }

              if (recipientId) {
                  emitNotification(recipientId, {
                      type: 'message',
                      title: projectData.title,
                      text: message.text,
                      projectId: message.projectId,
                      senderName: message.senderName
                  });
              }
          }
      } catch (notifyErr) {
          console.error("⚠️ Notification trigger failed (non-critical):", notifyErr);
      }

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
      }).sort((a, b) => a.createdAt - b.createdAt);

    } catch (err) {
      console.error("❌ getMessages failed:", err);
      return [];
    }
  }
}