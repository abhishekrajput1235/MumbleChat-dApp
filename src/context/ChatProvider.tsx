import {
  createContext, useReducer, useContext, ReactNode, useEffect, useCallback
} from 'react';
import {
  ChatState, ChatContextType, Message, Channel
} from '../types/chat';
import { useWalletContext } from './WalletContext';
import { useXmtpClient } from '../hooks/useXmtpClient';
import { StreamManager } from '../utils/streamManager';
import { DecodedMessage } from '@xmtp/xmtp-js';

// Global deduplication
const seenMessageIds = new Set<string>();
const seenChannelIds = new Set<string>();

const initialState: ChatState = {
  channels: [],
  currentChannelId: null,
  messages: {},
  users: {},
  unreadCount: {},
  loading: { channels: false, messages: false, users: false },
  error: null,
};

type ChatAction =
  | { type: 'SET_CHANNELS'; payload: Channel[] }
  | { type: 'SET_CURRENT_CHANNEL'; payload: string | null }
  | { type: 'SET_MESSAGES'; payload: { channelId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: { channelId: string; message: Message } }
  | { type: 'UPDATE_MESSAGE'; payload: { channelId: string; messageId: string; updates: Partial<Message> } }
  | { type: 'CREATE_CHANNEL'; payload: Channel }
  | { type: 'RESET_UNREAD'; payload: string };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_CHANNELS':
      return { ...state, channels: action.payload };

    case 'SET_CURRENT_CHANNEL':
      return { ...state, currentChannelId: action.payload };

    case 'SET_MESSAGES':
      return {
        ...state,
        messages: { ...state.messages, [action.payload.channelId]: action.payload.messages },
      };

    case 'ADD_MESSAGE':
      const updatedChannels = state.channels
        .map(channel =>
          channel.id === action.payload.channelId
            ? { ...channel, lastMessageAt: action.payload.message.timestamp }
            : channel
        )
        .sort((a, b) => b.lastMessageAt - a.lastMessageAt);
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.channelId]: [
            ...(state.messages[action.payload.channelId] || []),
            action.payload.message,
          ],
        },
        channels: updatedChannels,
      };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.channelId]: state.messages[action.payload.channelId].map(msg =>
            msg.id === action.payload.messageId
              ? { ...msg, ...action.payload.updates }
              : msg
          ),
        },
      };

    case 'CREATE_CHANNEL':
      const exists = state.channels.some(c => c.id === action.payload.id);
      if (exists) return state;
      const newChannels = [...state.channels, action.payload].sort((a, b) => b.lastMessageAt - a.lastMessageAt);
      return { ...state, channels: newChannels };

    case 'RESET_UNREAD':
      return {
        ...state,
        unreadCount: {
          ...state.unreadCount,
          [action.payload]: 0,
        },
      };

    default:
      return state;
  }
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { address, connected } = useWalletContext();
  const { xmtpClient } = useXmtpClient();

  const loadConversations = useCallback(async () => {
    if (!xmtpClient || !address) return;

    const convos = await xmtpClient.conversations.list();

    const channels: Channel[] = await Promise.all(
      convos.map(async (convo) => {
        const messages = await convo.messages({ limit: 1 });
        const lastMessage = messages[0];

        return {
          id: convo.peerAddress,
          name: convo.peerAddress,
          description: 'Direct Chat',
          isPrivate: true,
          createdBy: address,
          participants: [address, convo.peerAddress],
          lastMessageAt: lastMessage ? lastMessage.sent.getTime() : 0
        };
      })
    );

    const sortedChannels = channels.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    dispatch({ type: 'SET_CHANNELS', payload: sortedChannels });

    sortedChannels.forEach(c => seenChannelIds.add(c.id));
  }, [xmtpClient, address]);

  const fetchMessages = useCallback(async (channelId: string) => {
    if (!xmtpClient) return;

    const convo = await xmtpClient.conversations.newConversation(channelId);
    const msgs = await convo.messages({ limit: 100 });

    const messages: Message[] = msgs.map(msg => ({
      id: msg.id,
      sender: msg.senderAddress,
      content: msg.content,
      timestamp: msg.sent.getTime(),
      encrypted: true,
    }));

    dispatch({ type: 'SET_MESSAGES', payload: { channelId, messages } });
  }, [xmtpClient]);

  useEffect(() => {
    if (!xmtpClient || !address) return;

    const handleNewMessage = (msg: DecodedMessage) => {
      if (seenMessageIds.has(msg.id)) return;
      seenMessageIds.add(msg.id);

      const peer = msg.senderAddress === address
        ? msg.conversation.peerAddress
        : msg.senderAddress;

      if (!seenChannelIds.has(peer)) {
        seenChannelIds.add(peer);
        dispatch({
          type: 'CREATE_CHANNEL',
          payload: {
            id: peer,
            name: peer,
            description: 'Direct Chat',
            isPrivate: true,
            createdBy: address!,
            participants: [address!, peer],
            lastMessageAt: msg.sent.getTime(),
          }
        });
      }

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          channelId: peer,
          message: {
            id: msg.id,
            sender: msg.senderAddress,
            content: msg.content,
            timestamp: msg.sent.getTime(),
            encrypted: true,
          }
        }
      });
    };

    const streamManager = new StreamManager(xmtpClient, handleNewMessage);
    streamManager.startStream();

    return () => streamManager.stopStream();
  }, [xmtpClient, address]);

  useEffect(() => {
    if (connected) {
      loadConversations();
    }
  }, [connected, loadConversations]);

  const setCurrentChannel = (channelId: string | null) => {
    dispatch({ type: 'SET_CURRENT_CHANNEL', payload: channelId });
    dispatch({ type: 'RESET_UNREAD', payload: channelId || '' });
    if (channelId) fetchMessages(channelId);
  };

  return (
    <ChatContext.Provider
      value={{
        channels: state.channels,
        currentChannelId: state.currentChannelId,
        messages: state.messages,
        users: state.users,
        unreadCount: state.unreadCount,
        loading: state.loading,
        error: state.error,
        fetchMessages,
        setCurrentChannel
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChatContext must be used within ChatProvider');
  return context;
};
