import { useEffect, useRef, useState, useCallback } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useXmtpClient } from '../../hooks/useXmtpClient';
import { RefreshCcw } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { DecodedMessage, Conversation } from '@xmtp/xmtp-js';
import { isAddress } from 'ethers';

interface ChatListProps {
  channelId: string;
}

const ChatList = ({ channelId }: ChatListProps) => {
  const { address } = useWallet();
  const { xmtpClient, isLoadingXmtp, xmtpError } = useXmtpClient();

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [loadingChat, setLoadingChat] = useState(true);
  const [messages, setMessages] = useState<DecodedMessage[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const streamRef = useRef<AsyncIterator<DecodedMessage> | null>(null);
  const paginatorRef = useRef<any>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const loadMessages = useCallback(async (convo: Conversation) => {
    try {
      let allMessages: DecodedMessage[] = [];

      if (typeof (convo as any).listMessagesPaginated === 'function') {
        if (!paginatorRef.current) {
          const paginator = await (convo as any).listMessagesPaginated({
            direction: 'descending',
            pageSize: 50,
          });
          paginatorRef.current = paginator;
        }
        const page = await paginatorRef.current.next();
        let batch = page.value || [];
        batch = batch.reverse();
        allMessages = batch;
        setHasMore(!page.done);
      } else {
        const legacyMessages = await convo.messages({ limit: 1000 });
        allMessages = legacyMessages.sort((a, b) => a.sent.getTime() - b.sent.getTime());
        setHasMore(false);
      }
      setMessages(allMessages);
    } catch (error) {
      console.error("ChatList: Error loading messages:", error);
      setChatError("Failed to load message history.");
    }
  }, []);

  const loadOlderMessages = async () => {
    if (!paginatorRef.current) return;
    setLoadingOlder(true);
    try {
      const page = await paginatorRef.current.next();
      let batch: DecodedMessage[] = page.value || [];
      batch = batch.reverse();
      setMessages(prev => [...batch, ...prev]);
      setHasMore(!page.done);
    } finally {
      setLoadingOlder(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const setupConversationAndStream = async () => {
      if (!isAddress(channelId)) {
        setChatError('Invalid Ethereum address for channel.');
        setLoadingChat(false);
        return;
      }
      if (isLoadingXmtp || !xmtpClient) {
        setLoadingChat(true);
        return;
      }
      if (xmtpError) {
        setChatError(xmtpError);
        setLoadingChat(false);
        return;
      }
      if (streamRef.current) {
        try {
          await streamRef.current.return?.();
          streamRef.current = null;
        } catch (e) {}
      }
      try {
        setLoadingChat(true);
        setChatError(null);
        setMessages([]);

        const canMessage = await xmtpClient.canMessage(channelId);
        if (!isMounted) return;
        if (!canMessage) {
          setChatError('Recipient is not on the XMTP network.');
          setLoadingChat(false);
          return;
        }

        const convo = await xmtpClient.conversations.newConversation(channelId);
        if (!isMounted) return;

        await loadMessages(convo);
        if (!isMounted) return;
        setLoadingChat(false);

        const messageStream = await convo.streamMessages();
        if (!isMounted) return;
        streamRef.current = messageStream;

        for await (const newMsg of messageStream) {
          if (!isMounted) break;
          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('ChatList: Error:', err);
        setChatError(`Failed to load conversation: ${err.message || 'Unknown error'}.`);
        setLoadingChat(false);
      } finally {
        if (isMounted) {
          streamRef.current = null;
        }
      }
    };

    setupConversationAndStream();
    return () => {
      isMounted = false;
      if (streamRef.current) {
        try {
          streamRef.current.return?.();
          streamRef.current = null;
        } catch (e) {}
      }
    };
  }, [channelId, address, loadMessages, xmtpClient, isLoadingXmtp, xmtpError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages, loadingChat]);

  if (isLoadingXmtp || loadingChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-primary rounded-full" />
      </div>
    );
  }

  if (chatError) {
    return (
      <div className="p-6 text-center text-sm text-red-500">{chatError}</div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6">
      {hasMore && (
        <div className="flex justify-center mb-4">
          <button
            onClick={loadOlderMessages}
            disabled={loadingOlder}
            className="px-4 py-2 bg-background border border-border rounded-md text-sm flex items-center gap-2"
          >
            {loadingOlder ? (
              <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-primary rounded-full" />
            ) : (
              <>
                <RefreshCcw size={14} />
                Load Older Messages
              </>
            )}
          </button>
        </div>
      )}

      {/* ✅ Render messages with proper channelId and showHeader */}
      {messages.map((message, index) => {
        const prev = messages[index - 1];
        const showHeader = !prev || prev.senderAddress !== message.senderAddress;

        return (
          <ChatMessage
            key={message.id}
            message={{
              id: message.id,
              sender: message.senderAddress,
              content: message.content,
              timestamp: message.sent.getTime(),
              encrypted: true,
            }}
            channelId={channelId}
            isOwn={message.senderAddress.toLowerCase() === address?.toLowerCase()}
            showHeader={showHeader}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatList;
