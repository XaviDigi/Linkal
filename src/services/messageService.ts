// src/services/messageService.ts

import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

export const sendMessage = async (senderId: string, receiverId: string, content: string, isVisibleToSender: boolean) => {
  await addDoc(collection(db, 'messages'), {
    senderId,
    receiverId,
    content,
    timestamp: new Date(),
    isVisibleToSender // Store visibility preference
  });
};

export const listenForMessages = (currentUserId: string, otherUserId: string, setMessages: (messages: DocumentData[]) => void) => {
  const q = query(collection(db, 'messages'), where('receiverId', '==', otherUserId));

  return onSnapshot(q, (querySnapshot) => {
    const messagesData: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      const message = doc.data();
      if (message.senderId === currentUserId && message.isVisibleToSender) {
        messagesData.push({ id: doc.id, ...message });
      }
    });
    setMessages(messagesData);
  });
};
