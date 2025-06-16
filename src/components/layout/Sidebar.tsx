import { useChat } from '../../hooks/useChat';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState, useMemo } from 'react';
import NewChannelModal from '../modals/NewChannelModal';
import { truncateAddress } from '../../utils/formatters';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const {
    channels = [],
    unreadCount = {},
    setCurrentChannel,
    loading = { channels: false, messages: false, users: false }
  } = useChat();

  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeChannelId = useMemo(() => {
    const path = location.pathname;
    const match = path.match(/\/chat\/([^/]+)/);
    return match ? match[1] : null;
  }, [location]);

  // ✅ Pure deduplicated channels (safety layer)
  const uniqueChannels = useMemo(() => {
    const seen = new Set<string>();
    return channels.filter(channel => {
      if (seen.has(channel.id)) return false;
      seen.add(channel.id);
      return true;
    });
  }, [channels]);

  const handleSelectChannel = (channelId: string) => {
    setCurrentChannel?.(channelId);
    navigate(`/chat/${channelId}`);
    toggleSidebar(); // Auto close on mobile
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 bg-white/20 dark:bg-black/20 backdrop-blur-lg border border-white/15 z-50 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} md:static md:translate-x-0 md:w-64 flex flex-col`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">Chats</h2>
          <div className="flex gap-2">
            <button onClick={() => setIsModalOpen(true)} className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground" aria-label="New Channel">
              <Plus size={16} />
            </button>
            <button onClick={toggleSidebar} className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground md:hidden" aria-label="Close sidebar">
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {loading.channels ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-primary"></div>
            </div>
          ) : uniqueChannels.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              <p className="mb-2">No channels yet</p>
              <button onClick={() => setIsModalOpen(true)} className="btn btn-outline text-xs py-1 px-2">
                Create a channel
              </button>
            </div>
          ) : (
            <ul className="space-y-1 px-2">
              {uniqueChannels.map((channel) => (
                <li key={channel.id}>
                  <button
                    onClick={() => handleSelectChannel(channel.id)}
                    className={`w-full text-left flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-colors ${
                      activeChannelId === channel.id ? 'bg-primary text-white' : 'hover:bg-muted/30 text-foreground'
                    }`}
                  >
                    <span className="truncate">
                      {truncateAddress(channel.id, 4, 4)}
                    </span>
                    {unreadCount?.[channel.id] > 0 && (
                      <span className="bg-red-500 text-white rounded-full text-xs px-1">
                        {unreadCount[channel.id]}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">MumbleChat</span>
            <span className="ml-auto text-xs text-muted-foreground">v0.1.0</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Decentralized messaging on Ramestta</p>
        </div>
      </div>

      <NewChannelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Sidebar;
