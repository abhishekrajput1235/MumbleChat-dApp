import { useMemo } from 'react';
import { format } from 'date-fns';
import { Message } from '../../types/chat';

interface ChatMessageProps {
  message: Message;
  channelId: string;
  isOwn: boolean;
  showHeader: boolean;
}

const ChatMessage = ({ message, channelId, isOwn }: ChatMessageProps) => {
  const formattedTime = format(new Date(message.timestamp), 'hh:mm a');

  return (
    <div className={`flex mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        <div
          className={`relative px-4 py-3 rounded-lg ${
            isOwn
              ? 'bg-primary/20 text-foreground rounded-tr-none backdrop-blur-md'
              : ' text-foreground rounded-tl-none backdrop-blur-md'
          }`}
        >
          <p className="whitespace-pre-wrap break-words pb-5">{message.content}</p>

          <div className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
