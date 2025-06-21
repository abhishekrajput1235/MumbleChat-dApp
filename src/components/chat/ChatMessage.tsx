
import { format } from 'date-fns';
import { useState, useRef, useEffect } from 'react';
import { FiShare2, FiCopy } from 'react-icons/fi';
import { LuReply } from 'react-icons/lu';
import { TfiPin2 } from 'react-icons/tfi';
import { CiMenuKebab } from 'react-icons/ci';
import { toast } from 'react-hot-toast';
import { Store } from '../../store/Store';
import { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
  channelId: string;
  isOwn: boolean;
  showHeader: boolean;
  scrollTargetId?: string;
  highlighted?: boolean;
  onReply?: (message: Message) => void;
  onForward?: (message: Message) => void;
  onPin?: (message: Message) => void;
}

const ChatMessage = ({
  message,
  isOwn,
  channelId,
  scrollTargetId,
  highlighted = false,
  onReply,
  onForward,
  onPin,
}: ChatMessageProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const formattedTime = format(new Date(message.timestamp), 'hh:mm a');

  // Auto-scroll to message if it's the targeted one
  useEffect(() => {
    if (scrollTargetId === message.id && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [scrollTargetId, message.id]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content.trim());
    toast.success('Message copied to clipboard');
    setIsMenuOpen(false);
  };

  const handleReply = () => {
    Store.getState().setReplyMessage(channelId, message);
    onReply?.(message);
    setIsMenuOpen(false);
  };

  const handleForward = () => {
    onForward?.(message);
    setIsMenuOpen(false);
  };

  const handlePin = () => {
    Store.getState().pinMessage(channelId, message);
    Store.getState().setScrollToMessageId(message.id);
    onPin?.(message);
    setIsMenuOpen(false);
  };
  // const handlePin = () => {
  //   const pinnedKey = `pinnedMessages_${channelId}`;
  
  //   // Get current pinned messages from localStorage
  //   const current = JSON.parse(localStorage.getItem(pinnedKey) || '[]');
  
  //   // Add new message if not already pinned
  //   if (!current.some((m: any) => m.id === message.id)) {
  //     const updated = [...current, message];
  //     localStorage.setItem(pinnedKey, JSON.stringify(updated));
  //   }
  
  //   // Optional: trigger UI highlight or jump
  //   Store.getState().setScrollToMessageId(message.id);
  //   onPin?.(message);
  //   setIsMenuOpen(false);
  // };
  

  return (
    <div
      ref={messageRef}
      className={`flex mb-4 px-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`w-full max-w-[90%] sm:max-w-[80%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        <div
          className={`
            relative w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 
            px-3 py-2 sm:px-4 sm:py-3 rounded-xl shadow-md backdrop-blur-md border-[0.3px]
            transition duration-300 break-words whitespace-pre-wrap
            ${isOwn ? 'bg-white/5 text-white rounded-tr-none' : 'bg-white/5 text-white rounded-tl-none'}
            ${highlighted ? 'border-[#0fff] shadow-cyan-500/40 border-2' : 'hover:border-[#01ffff] hover:shadow-xl hover:shadow-cyan-500/20'}
          `}
        >
          {/* Message Content */}
          <div className="w-full mb-3 text-left text-sm sm:text-base">
            {message.content.trim()}
          </div>

          {/* Timestamp & Menu */}
          <div className={`absolute bottom-1 ${isOwn ? 'right-2' : 'right-2'} flex items-center text-xs text-white/70`}>
            <span>{formattedTime}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen((prev) => !prev);
              }}
              className="ml-2 hover:text-white/90 transition"
            >
              <CiMenuKebab size={18} className="text-[#0fff]" />
            </button>
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className={`absolute ${isOwn ? 'right-0' : 'right-0'} bottom-8 z-10 w-40 bg-gray-800 rounded-md shadow-lg py-1 border border-gray-700`}
            >
              <button
                onClick={handleReply}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                <LuReply className="mr-2" /> Reply
              </button>
              <button
                onClick={handleForward}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                <FiShare2 className="mr-2" /> Forward
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                <FiCopy className="mr-2" /> Copy
              </button>
              <button
                onClick={handlePin}
                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                <TfiPin2 className="mr-2" /> Pin Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;



