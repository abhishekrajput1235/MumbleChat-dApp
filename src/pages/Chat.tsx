import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Copy } from 'lucide-react';
import { isAddress } from 'ethers';
import { useChat } from '../hooks/useChat'; // Manages channel list
import { useXmtpClient } from '../hooks/useXmtpClient'; // Centralized XMTP client hook
import { useWallet } from '../hooks/useWallet'; // Wallet state hook
import { motion } from 'framer-motion';
import PinnedBox from '../components/chat/PinnedBox';
import ReplyBox from '../components/chat/ReplyBox';


import ChatList from '../components/chat/ChatList';
import ChatInput from '../components/chat/ChatInput';
import { Conversation } from '@xmtp/xmtp-js';
import toast from 'react-hot-toast';
import smsBg from '../img/smsBg.jpg';

const Chat = () => {
  const { channelId } = useParams<{ channelId?: string }>();
  const navigate = useNavigate();
  const { channels, currentChannelId, setCurrentChannel, loading: chatContextLoading } = useChat();
  const { xmtpClient, isLoadingXmtp, xmtpError } = useXmtpClient();
  const { address, connected, connecting: walletConnecting, error: walletConnectError } = useWallet();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [canMessageRecipient, setCanMessageRecipient] = useState<boolean | null>(null);
  const [chatPageSpecificError, setChatPageSpecificError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Copied address!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (channelId && channelId !== currentChannelId) {
      setCurrentChannel(channelId);
    } else if (!channelId && currentChannelId) {
      setCurrentChannel(null);
    }
  }, [channelId, currentChannelId, setCurrentChannel]);

  useEffect(() => {
    let isMounted = true;

    const setupXmtpConversation = async () => {
      setChatPageSpecificError(null);

      if (!connected) {
        setChatPageSpecificError(walletConnectError || "Wallet not connected. Please connect your wallet.");
        setConversation(null);
        setCanMessageRecipient(null);
        return;
      }
      if (isLoadingXmtp || walletConnecting) {
        setConversation(null);
        setCanMessageRecipient(null);
        return;
      }
      if (xmtpError) {
        setChatPageSpecificError(xmtpError);
        setConversation(null);
        setCanMessageRecipient(false);
        return;
      }
      if (!xmtpClient) {
        setChatPageSpecificError("XMTP client not available. Please ensure your wallet is connected and XMTP is initialized.");
        setConversation(null);
        setCanMessageRecipient(false);
        return;
      }
      if (!currentChannelId) {
        setConversation(null);
        setCanMessageRecipient(null);
        return;
      }

      if (!isAddress(currentChannelId)) {
        setChatPageSpecificError('Invalid recipient address for chat channel.');
        setConversation(null);
        setCanMessageRecipient(false);
        return;
      }

      if (address && currentChannelId.toLowerCase() === address.toLowerCase()) {
        setChatPageSpecificError("You cannot message yourself directly in this chat view.");
        setConversation(null);
        setCanMessageRecipient(false);
        return;
      }

      try {
        const canMsg = await xmtpClient.canMessage(currentChannelId);
        if (!isMounted) return;
        setCanMessageRecipient(canMsg);

        if (canMsg) {
          const convo = await xmtpClient.conversations.newConversation(currentChannelId);
          if (!isMounted) return;
          setConversation(convo);
          setChatPageSpecificError(null);
        } else {
          setConversation(null);
          setChatPageSpecificError("Recipient is not on the MumbleChat network or has not enabled messaging.");
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error setting up conversation in Chat.tsx:", error);
        setChatPageSpecificError("Failed to set up chat. Please try again.");
        setConversation(null);
        setCanMessageRecipient(false);
      }
    };

    setupXmtpConversation();

    return () => {
      isMounted = false;
    };
  }, [xmtpClient, currentChannelId, address, connected, isLoadingXmtp, xmtpError, walletConnecting, walletConnectError]);

  const isOverallLoading = isLoadingXmtp || walletConnecting || chatContextLoading.channels || chatContextLoading.messages;
  const displayError = chatPageSpecificError || xmtpError || walletConnectError;

  const currentChannel = channels.find((c) => c.id === currentChannelId);

  if (isOverallLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2  border-white/15 mb-4"></div>
        <p className="text-muted-foreground">Setting up secure messaging...</p>
      </div>
    );
  }

  if (displayError) {
    const isXmtpSignatureError = displayError.includes("Failed to validate wallet signature for XMTP") || displayError.includes("XMTP signature rejected by user");

    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-error/10 text-error rounded-full p-4 mb-4">
          <MessageCircle size={32} />
        </div>
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          {isXmtpSignatureError
            ? "Please check MetaMask for a signature request and approve it to enable MumbleChat messaging."
            : displayError}
        </p>
        <button
          onClick={() => {
            if (walletConnectError) {
              navigate('/connect');
            } else {
              window.location.reload();
            }
          }}
          className="btn btn-primary"
        >
          {walletConnectError ? "Connect Wallet" : "Try Again"}
        </button>
      </div>
    );
  }

  if (!currentChannelId || !currentChannel) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          {/* <MessageCircle size={50} className='text-[#0fff] animate-pulse' /> */}
          <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="w-24 h-24 rounded-full bg-[#0AFFF1]/10 flex items-center justify-center text-[#0AFFF1] mb-8 relative"
                    >
                        <MessageCircle size={48} />
                        <motion.div
                            className="absolute inset-0 rounded-full border border-[#0AFFF1]/30"
                            initial={{ scale: 1 }}
                            animate={{ scale: 1.2, opacity: [1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full border border-[#0AFFF1]/20"
                            initial={{ scale: 1 }}
                            animate={{ scale: 1.4, opacity: [1, 0] }}
                            transition={{ duration: 2, delay: 0.3, repeat: Infinity }}
                        />
                    </motion.div>
        </div>
        <h3 className="text-xl font-medium mb-2">No chat selected</h3>
        <p className="text-center text-muted-foreground max-w-md mb-4">
          {channels.length > 0
            ? "Select a chat from the sidebar to start messaging."
            : "You don't have any active chats yet. Start a new one!"}
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${smsBg})` }}
      />

      {/* Chat UI */}
      <div className="relative z-0 flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="shrink-0 px-4 py-3 border-b-2 border-white/15 bg-background/80 backdrop-blur-md">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm font-mono text-gray-300">
                  <span>
                    {currentChannel.name.slice(0, 5)}....{currentChannel.name.slice(-5)}
                  </span>
                  <button
                    onClick={() => handleCopy(currentChannel.name)}
                    title={copied ? "Copied!" : "Copy address"}
                    className="text-gray-500 hover:text-primary transition duration-150"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                {currentChannel.isPrivate && (
                  <span className="ml-2 text-xs bg-slate-600 px-1.5 py-0.5 rounded text-muted-foreground">
                    Private Chat
                  </span>
                )}
              </h2>
              {currentChannel.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {currentChannel.description}
                </p>
              )}
            </div>
          </div>
   

        </div>
               {/* PinedMessage */}
               <PinnedBox channelId={currentChannelId} />





        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <ChatList channelId={currentChannelId} />
        </div>


        <ReplyBox channelId={currentChannelId} />

        {/* Chat Input */}
        <div className="shrink-0 bg-background/80 backdrop-blur-md">
          {connected && conversation && canMessageRecipient ? (
            <ChatInput conversation={conversation} />
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {!connected
                ? "Please connect your wallet to send messages."
                : canMessageRecipient === false
                ? "This user can't receive messages yet (not on XMTP network or keys not published)."
                : "Setting up chat..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;



