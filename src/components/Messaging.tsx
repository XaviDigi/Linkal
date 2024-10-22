// src/components/Messaging.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendMessage, listenForMessages } from '../services/messageService';
import { DocumentData } from 'firebase/firestore';

interface MessagingProps {
  userId: string;
}

const Messaging: React.FC<MessagingProps> = ({ userId }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    const unsubscribe = listenForMessages(currentUser!.uid, userId, setMessages);
    return () => unsubscribe();
  }, [currentUser!.uid, userId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    // Store message for sender only
    await sendMessage(currentUser!.uid, userId, messageContent, true); // Pass true for sender visibility
    setMessageContent('');
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <p>{message.content}</p>
            <span>{new Date(message.timestamp.toDate()).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Type a message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Messaging;
