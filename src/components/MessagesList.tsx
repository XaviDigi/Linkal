import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
}

const MessagesList: React.FC<{ receiverId: string }> = ({ receiverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), where('receiver', '==', receiverId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData: Message[] = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp.toDate() } as Message);
      });
      setMessages(messagesData);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [receiverId]);

  return (
    <div className="mt-4">
      <h4 className="text-xl font-bold mb-2">Messages</h4>
      <div className="bg-gray-100 rounded-lg p-4">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="border-b mb-2 pb-2">
              <p><strong>{message.sender}:</strong> {message.content}</p>
              <span className="text-gray-500 text-sm">{message.timestamp.toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesList;
