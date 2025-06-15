import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { Send, Lock } from 'lucide-react';
import { Conversation } from '@xmtp/xmtp-js';

interface ChatInputProps {
  conversation: Conversation;
}

const ChatInput = ({ conversation }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  // ✅ Typing indicator is now purely local — no XMTP message sent
  const sendTypingIndicator = () => {
    if (!isTyping) {
      setIsTyping(true);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    try {
      setIsSending(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        setIsTyping(false);
      }
      await conversation.send(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 0);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      sendTypingIndicator();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-input py-3 px-4">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-32"
            disabled={isSending}
            rows={1}
          />
          <div className="absolute right-3 bottom-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Lock size={12} />
            <span>End-to-end encrypted</span>
          </div>
        </div>
        <button
          type="submit"
          className="flex-shrink-0 h-10 w-10 rounded-md bg-primary text-white flex items-center justify-center hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          disabled={!message.trim() || isSending}
        >
          {isSending ? (
            <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
