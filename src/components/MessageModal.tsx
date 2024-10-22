import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiverId: string; // ID of the startup to send a message to
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, receiverId }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send the message to Firestore
    await addDoc(collection(db, 'messages'), {
      sender: 'currentUserId',
      receiver: receiverId,
      content: message,
      timestamp: new Date(),
    });

    // Clear the message and close the modal
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h3 className="text-lg font-bold mb-4">Send a Message</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full h-24 border rounded-lg p-2 mb-4"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <div className="flex justify-between">
            <button type="button" className="text-gray-500" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-500 text-white py-1 px-3 rounded-lg">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageModal;
