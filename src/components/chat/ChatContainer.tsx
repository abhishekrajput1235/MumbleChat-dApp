import { useState, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { FiX, FiSend } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello everyone!',
      sender: 'user1',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      content: 'How are you doing?',
      sender: 'user2',
      timestamp: new Date().toISOString(),
    }
  ]);

  const [pinnedMessageId, setPinnedMessageId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const handleForward = (message: Message) => {
    setForwardingMessage(message);
  };

  const handlePin = (message: Message) => {
    setPinnedMessageId(prev => prev === message.id ? null : message.id);
    toast.success(message.id === pinnedMessageId ? 'Message unpinned' : 'Message pinned');
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user1',
      timestamp: new Date().toISOString(),
      ...(replyingTo && { 
        replyTo: {
          id: replyingTo.id,
          content: replyingTo.content,
          sender: replyingTo.sender,
          timestamp: replyingTo.timestamp
        }
      })
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    setReplyingTo(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwn={message.sender === 'user1'}
            onReply={handleReply}
            onForward={handleForward}
            onPin={handlePin}
            isPinned={pinnedMessageId === message.id}
          />
        ))}
      </div>

      {replyingTo && (
        <div className="px-4 pt-2 bg-gray-800 border-t border-gray-700">
          <div className="flex justify-between items-center bg-gray-700 rounded-t-lg p-2">
            <div className="text-xs">
              <span className="text-blue-400">Replying to {replyingTo.sender}</span>
              <div className="text-sm text-gray-300 truncate">{replyingTo.content}</div>
            </div>
            <button 
              onClick={() => setReplyingTo(null)}
              className="text-gray-400 hover:text-white"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="p-3 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={replyingTo ? 'Reply to message...' : 'Type a message...'}
            className="flex-1 p-3 bg-gray-700 rounded-lg focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="ml-3 p-3 bg-blue-600 rounded-full disabled:opacity-50"
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>

      {forwardingMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full mx-4 border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-medium">Forward Message</h3>
            </div>
            <div className="p-4">
              <p className="mb-4 p-3 bg-gray-700 rounded-lg">{forwardingMessage.content}</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => setForwardingMessage(null)} 
                  className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Implement actual forwarding logic here
                    console.log('Forwarding message:', forwardingMessage);
                    setForwardingMessage(null);
                    toast.success('Message forwarded');
                  }} 
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Forward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  replyTo?: {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
  };
}