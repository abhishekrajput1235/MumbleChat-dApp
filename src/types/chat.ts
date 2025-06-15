export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
  signature?: string;
  encrypted: boolean;
  nickname?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: Record<string, string[]>;  // emoji reactions
  editedContent?: string;                // if message is edited
  deleted?: boolean;                     // soft delete flag
}


export interface Channel {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdBy: string;
  participants: string[];
  lastMessageAt: number;
}

export interface User {
  address: string;
  displayName: string | null;
  avatar: string | null;
  status: 'online' | 'offline' | 'away';
  lastSeen: number;
}

export interface ChatState {
  channels: Channel[];
  currentChannelId: string | null;
  messages: Record<string, Message[]>;
  users: Record<string, User>;
  unreadCount: Record<string, number>;   // ✅ Added for unread messages
  loading: {
    channels: boolean;
    messages: boolean;
    users: boolean;
  };
  error: string | null;
}

export type ChatContextType = Partial<{
  channels: Channel[];
  currentChannelId: string | null;
  messages: Record<string, Message[]>;
  users: Record<string, User>;
  unreadCount: Record<string, number>;
  loading: ChatState['loading'];
  error: string | null;
  sendMessage: (channelId: string, content: string) => Promise<void>;
  createChannel: (id: string, description: string, isPrivate: boolean) => Promise<void>;
  joinChannel: (channelId: string) => Promise<void>;
  leaveChannel: (channelId: string) => Promise<void>;
  updateUserProfile: (displayName: string, avatar: string) => Promise<void>;
  fetchMessages: (channelId: string) => Promise<void>;
  setCurrentChannel: (channelId: string | null) => void;
  
  // ✅ Added Phase 4.1 functions:
  addReaction: (channelId: string, messageId: string, emoji: string, userAddress: string) => void;
  editMessage: (channelId: string, messageId: string, newContent: string) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
  markMessageRead: (channelId: string, messageId: string) => void;
}>;

