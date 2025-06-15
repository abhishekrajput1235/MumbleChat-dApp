import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { isAddress } from 'ethers'; 
import { useChat } from '../hooks/useChat'; // Assuming this manages your channel list
import { useXmtpClient } from '../hooks/useXmtpClient'; // Centralized XMTP client hook
import { useWallet } from '../hooks/useWallet'; // Wallet state hook

import ChatList from '../components/chat/ChatList';
import ChatInput from '../components/chat/ChatInput';
import { Conversation } from '@xmtp/xmtp-js';

const Chat = () => {
  const { channelId } = useParams<{ channelId?: string }>();
  const navigate = useNavigate();
  const { channels, currentChannelId, setCurrentChannel, loading: chatContextLoading } = useChat();
  const { xmtpClient, isLoadingXmtp, xmtpError } = useXmtpClient(); // Consume centralized XMTP client
  const { address, connected, connecting: walletConnecting, error: walletConnectError } = useWallet(); // Get wallet state

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [canMessageRecipient, setCanMessageRecipient] = useState<boolean | null>(null); // Null for unknown, true/false when checked
  const [chatPageSpecificError, setChatPageSpecificError] = useState<string | null>(null); // Errors specific to this chat page's logic

  // Effect to set the current channel based on URL parameter
  useEffect(() => {
    if (channelId && channelId !== currentChannelId) {
      setCurrentChannel(channelId); // Update the global chat context state
    } else if (!channelId && currentChannelId) {
        // If URL has no channelId but state does, clear state
        setCurrentChannel(null);
    }
  }, [channelId, currentChannelId, setCurrentChannel]);

  // Effect to establish XMTP conversation and check messageability of the recipient
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    const setupXmtpConversation = async () => {
      setChatPageSpecificError(null); // Clear previous errors

      // 1. Check overall wallet and XMTP client status first
      if (!connected) {
          setChatPageSpecificError(walletConnectError || "Wallet not connected. Please connect your wallet.");
          setConversation(null);
          setCanMessageRecipient(null); // Reset
          return;
      }
      if (isLoadingXmtp || walletConnecting) { // If XMTP client or wallet is still loading/connecting
          setConversation(null);
          setCanMessageRecipient(null); // Reset
          return; // Wait for the client to be ready
      }
      if (xmtpError) { // If there's an error with XMTP client initialization
          setChatPageSpecificError(xmtpError);
          setConversation(null);
          setCanMessageRecipient(false);
          return;
      }
      if (!xmtpClient) { // Should not happen if xmtpError is handled, but as a safeguard
          setChatPageSpecificError("XMTP client not available. Please ensure your wallet is connected and XMTP is initialized.");
          setConversation(null);
          setCanMessageRecipient(false);
          return;
      }
      if (!currentChannelId) { // No channel selected yet
          setConversation(null);
          setCanMessageRecipient(null);
          return;
      }

      // 2. Validate the channel ID as an Ethereum address
      if (!isAddress(currentChannelId)) {
        setChatPageSpecificError('Invalid recipient address for chat channel.');
        setConversation(null);
        setCanMessageRecipient(false);
        return;
      }

      // 3. Prevent messaging self
      if (address && currentChannelId.toLowerCase() === address.toLowerCase()) {
        setChatPageSpecificError("You cannot message yourself directly in this chat view.");
        setConversation(null);
        setCanMessageRecipient(false);
        return;
      }

      // 4. Attempt to establish conversation logic
      try {
        // Check if the recipient can be messaged on the XMTP network
        const canMsg = await xmtpClient.canMessage(currentChannelId);
        if (!isMounted) return; // Exit if component unmounted during async operation
        setCanMessageRecipient(canMsg);

        if (canMsg) {
          // Get or create the conversation object. This creates it if it doesn't exist.
          const convo = await xmtpClient.conversations.newConversation(currentChannelId);
          if (!isMounted) return;
          setConversation(convo); // This conversation object will be passed to ChatInput
          setChatPageSpecificError(null); // Clear errors if successful
        } else {
          setConversation(null); // Clear conversation if recipient cannot be messaged
          setChatPageSpecificError("Recipient is not on the XMTP network or has not enabled messaging.");
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

    // Cleanup function for the effect
    return () => {
      isMounted = false; // Mark component as unmounted
    };
  }, [xmtpClient, currentChannelId, address, connected, isLoadingXmtp, xmtpError, walletConnecting, walletConnectError]); // Dependencies

  // Combine loading and error states for display logic
  const isOverallLoading = isLoadingXmtp || walletConnecting || chatContextLoading.channels || chatContextLoading.messages;
  const displayError = chatPageSpecificError || xmtpError || walletConnectError;

  // Find the current channel object for display purposes
  const currentChannel = channels.find((c) => c.id === currentChannelId);

  // --- Render Logic ---

  if (isOverallLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Setting up secure messaging...</p>
      </div>
    );
  }

  if (displayError) {
    // Check for the specific XMTP signature error
    const isXmtpSignatureError = displayError.includes("Failed to validate wallet signature for XMTP") || displayError.includes("XMTP signature rejected by user");

    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-error/10 text-error rounded-full p-4 mb-4">
          <MessageCircle size={32} />
        </div>
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          {isXmtpSignatureError
            ? "Please check MetaMask for a signature request and approve it to enable XMTP messaging."
            : displayError}
        </p>
        <button
          onClick={() => {
              if (walletConnectError) {
                  navigate('/connect'); // If wallet connection error, go to connect page
              } else {
                  // For XMTP signature errors or other general errors, try refreshing
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
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <MessageCircle size={32} />
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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat Header */}
      <div className="shrink-0 px-4 py-3 border-b border-border bg-background">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium flex items-center">
              {currentChannel.name}
              {currentChannel.isPrivate && (
                <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  Private
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

      {/* Chat Messages List (Scrollable) */}
      <div className="flex-1 overflow-y-auto">
        <ChatList channelId={currentChannelId} />
      </div>

      {/* Chat Input Area */}
      <div className="shrink-0 border-t border-border bg-background">
        {connected && conversation && canMessageRecipient ? (
          <ChatInput conversation={conversation} />
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {!connected ? (
                "Please connect your wallet to send messages."
            ) : (canMessageRecipient === false
              ? "This user can't receive messages yet (not on XMTP network or keys not published)."
              : "Setting up chat...")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
