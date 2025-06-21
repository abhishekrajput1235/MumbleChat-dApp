// import { create } from 'zustand';
// import { Message } from '../types/chat';

// interface ChatStore {
//   // Pin related
//   pinnedMessages: Record<string, Message>;
//   pinMessage: (channelId: string, msg: Message) => void;
//   unpinMessage: (channelId: string) => void;

//   // Reply related
//   replyMessages: Record<string, Message>;
//   setReplyMessage: (channelId: string, msg: Message) => void;
//   clearReplyMessage: (channelId: string) => void;

//   // Forward related
//   forwardMessages: Record<string, Message>;
//   setForwardMessage: (channelId: string, msg: Message) => void;
//   clearForwardMessage: (channelId: string) => void;

//   // Scroll related
//   scrollToMessageId: string | null;
//   setScrollToMessageId: (id: string | null) => void;

  
// }

// export const Store = create<ChatStore>((set) => ({
//   // Initial state
//   pinnedMessages: {},
//   replyMessages: {},
//   forwardMessages: {},
//   scrollToMessageId: null,

//   // Pin handlers
//   pinMessage: (channelId, msg) =>
//     set((state) => ({
//       pinnedMessages: {
//         ...state.pinnedMessages,
//         [channelId]: msg,
//       },
//     })),

//   unpinMessage: (channelId) =>
//     set((state) => {
//       const updated = { ...state.pinnedMessages };
//       delete updated[channelId];
//       return { pinnedMessages: updated };
//     }),

//   // Reply handlers
//   setReplyMessage: (channelId, msg) =>
//     set((state) => ({
//       replyMessages: {
//         ...state.replyMessages,
//         [channelId]: msg,
//       },
//     })),

//   clearReplyMessage: (channelId) =>
//     set((state) => {
//       const updated = { ...state.replyMessages };
//       delete updated[channelId];
//       return { replyMessages: updated };
//     }),

//   // Forward handlers
//   setForwardMessage: (channelId, msg) =>
//     set((state) => ({
//       forwardMessages: {
//         ...state.forwardMessages,
//         [channelId]: msg,
//       },
//     })),

//   clearForwardMessage: (channelId) =>
//     set((state) => {
//       const updated = { ...state.forwardMessages };
//       delete updated[channelId];
//       return { forwardMessages: updated };
//     }),

//   // Scroll handler
//   setScrollToMessageId: (id) => set({ scrollToMessageId: id }),
// }));


import { create } from 'zustand';
import { Message } from '../types/chat';

// Utility functions for localStorage
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Fail silently
  }
};

interface ChatStore {
  // Pin related
  pinnedMessages: Record<string, Message>;
  pinMessage: (channelId: string, msg: Message) => void;
  unpinMessage: (channelId: string) => void;

  // Reply related
  replyMessages: Record<string, Message>;
  setReplyMessage: (channelId: string, msg: Message) => void;
  clearReplyMessage: (channelId: string) => void;

  // Forward related
  forwardMessages: Record<string, Message>;
  setForwardMessage: (channelId: string, msg: Message) => void;
  clearForwardMessage: (channelId: string) => void;

  // Scroll related
  scrollToMessageId: string | null;
  setScrollToMessageId: (id: string | null) => void;

  // Block related
  blockedAddresses: string[];
  blockAddress: (address: string) => void;
  unblockAddress: (address: string) => void;
  isBlocked: (address: string) => boolean;
}

export const Store = create<ChatStore>((set, get) => ({
  // Load initial state from localStorage
  pinnedMessages: getLocalStorage<Record<string, Message>>('pinnedMessages', {}),
  replyMessages: {},
  forwardMessages: {},
  scrollToMessageId: null,
  blockedAddresses: getLocalStorage<string[]>('blockedAddresses', []),

  // Pin handlers
  pinMessage: (channelId, msg) => {
    const updated = {
      ...get().pinnedMessages,
      [channelId]: msg,
    };
    setLocalStorage('pinnedMessages', updated);
    set({ pinnedMessages: updated });
  },

  unpinMessage: (channelId) => {
    const updated = { ...get().pinnedMessages };
    delete updated[channelId];
    setLocalStorage('pinnedMessages', updated);
    set({ pinnedMessages: updated });
  },

  // Reply handlers
  setReplyMessage: (channelId, msg) =>
    set((state) => ({
      replyMessages: {
        ...state.replyMessages,
        [channelId]: msg,
      },
    })),

  clearReplyMessage: (channelId) =>
    set((state) => {
      const updated = { ...state.replyMessages };
      delete updated[channelId];
      return { replyMessages: updated };
    }),

  // Forward handlers
  setForwardMessage: (channelId, msg) =>
    set((state) => ({
      forwardMessages: {
        ...state.forwardMessages,
        [channelId]: msg,
      },
    })),

  clearForwardMessage: (channelId) =>
    set((state) => {
      const updated = { ...state.forwardMessages };
      delete updated[channelId];
      return { forwardMessages: updated };
    }),

  // Scroll handler
  setScrollToMessageId: (id) => set({ scrollToMessageId: id }),

  // Block handlers
  blockAddress: (address) => {
    const lower = address.toLowerCase();
    const updated = Array.from(new Set([...get().blockedAddresses, lower]));
    setLocalStorage('blockedAddresses', updated);
    set({ blockedAddresses: updated });
  },

  unblockAddress: (address) => {
    const lower = address.toLowerCase();
    const updated = get().blockedAddresses.filter((a) => a !== lower);
    setLocalStorage('blockedAddresses', updated);
    set({ blockedAddresses: updated });
  },

  isBlocked: (address) => {
    const lower = address.toLowerCase();
    return get().blockedAddresses.includes(lower);
  },
}));

