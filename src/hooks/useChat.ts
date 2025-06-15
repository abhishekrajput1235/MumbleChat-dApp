import { useChatContext } from '../context/ChatContext';

export const useChat = () => {
  return useChatContext();
};