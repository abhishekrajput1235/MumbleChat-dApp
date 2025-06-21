// import { useChat } from '../../hooks/useChat';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ChevronLeft, Plus, Search } from 'lucide-react';
// import { useState, useMemo } from 'react';
// import NewChannelModal from '../modals/NewChannelModal';
// import { truncateAddress } from '../../utils/formatters';
// import smsBg from '../../img/smsBg.jpg';

// interface SidebarProps {
//   isOpen: boolean;
//   toggleSidebar: () => void;
// }

// const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
//   const {
//     channels = [],
//     unreadCount = {},
//     setCurrentChannel,
//     loading = { channels: false, messages: false, users: false }
//   } = useChat();

//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const activeChannelId = useMemo(() => {
//     const path = location.pathname;
//     const match = path.match(/\/chat\/([^/]+)/);
//     return match ? match[1] : null;
//   }, [location]);

//   const uniqueChannels = useMemo(() => {
//     const seen = new Set<string>();
//     return channels.filter(channel => {
//       if (seen.has(channel.id)) return false;
//       seen.add(channel.id);
//       return true;
//     });
//   }, [channels]);

//   const filteredChannels = useMemo(() => {
//     if (!searchQuery) return uniqueChannels;
//     const lowerQuery = searchQuery.toLowerCase();

//     return uniqueChannels.filter((channel) => {
//       const fullId = channel.id.toLowerCase();
//       const shortId = truncateAddress(channel.id, 4, 4).toLowerCase();
//       return fullId.includes(lowerQuery) || shortId.includes(lowerQuery);
//     });
//   }, [searchQuery, uniqueChannels]);

//   const handleSelectChannel = (channelId: string) => {
//     setCurrentChannel?.(channelId);
//     navigate(`/chat/${channelId}`);
//     toggleSidebar(); // Auto close on mobile
//   };

//   return (
//     <>
//       {/* <div
//         className={`fixed inset-y-0 left-0 bg-white/20 dark:bg-black/20 backdrop-blur-lg h-full border-r-2  border-white/15 z-50 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} md:static md:translate-x-0 md:w-64 flex flex-col`}
//       > */}
//       <div
//         className={`
//     fixed inset-0 z-[50] h-full transform transition-transform duration-300 ease-in-out
//     ${isOpen ? 'translate-x-0' : '-translate-x-full'}
//     w-[155%] md:w-64
//     bg-white/20 dark:bg-black/20 backdrop-blur-lg border-r-2 border-white/15
//     md:static md:translate-x-0 flex flex-col
//   `}
//         style={{ backgroundImage: `url(${smsBg})` }}
//       >



//         {/* Header */}
//         <div className="p-3 border-b-2  border-white/15 flex items-center justify-between">
//           <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-[#01FFFF]">Chats</h2>
//           <div className="flex gap-2 mr-6">
//             <button onClick={() => setIsModalOpen(true)} className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground" aria-label="New Channel">
//               <Plus size={26} className="font-bold" />
//             </button>
//             <button onClick={toggleSidebar} className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground md:hidden" aria-label="Close sidebar">
//               <ChevronLeft size={28} />
//             </button>
//           </div>
//         </div>

//         {/* Search */}
//         <div className="px-3 py-2 border-b-2  border-white/15">
//           <div className="flex items-center gap-2 bg-muted/20 px-3 py-[16.5px] rounded-md">
//             <Search size={16} className="text-muted-foreground" />
//             <input
//               type="text"
//               placeholder="Search channels..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="bg-transparent outline-none text-sm w-full text-foreground"
//             />
//           </div>
//         </div>

//         {/* Channel List */}
//         <div className="flex-1 overflow-y-auto py-2">
//           {loading.channels ? (
//             <div className="flex justify-center items-center py-10">
//               <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-primary"></div>
//             </div>
//           ) : filteredChannels.length === 0 ? (
//             <div className="px-4 py-6 text-center text-muted-foreground text-sm">
//               <p className="mb-2">🔍 No channels match your search.</p>
//               <button onClick={() => setIsModalOpen(true)} className="text-xs underline hover:text-primary">
//                 + Create new
//               </button>
//             </div>
//           ) : (
//             <ul className="space-y-1 px-2">
//               {filteredChannels.map((channel) => {
//                 const lastTwo = channel.id.slice(-2).toUpperCase();
//                 return (
//                   <li key={channel.id}>
//                     <button
//                       onClick={() => handleSelectChannel(channel.id)}
//                       className={`w-full text-left flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-colors ${activeChannelId === channel.id
//                         ? 'bg-white/15 text-[#0fff] border border-[#0fff]'
//                         : 'hover:bg-muted/30 text-foreground'
//                         }`}
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0fff] bg-white/15 text-white text-xs font-semibold">
//                           {lastTwo}
//                         </div>
//                         <span className="truncate ">
//                           {truncateAddress(channel.id, 4, 4)}
//                         </span>
//                       </div>
//                       {unreadCount?.[channel.id] > 0 && (
//                         <span className="bg-green-500 text-black rounded-full text-xl px-2">
//                           {unreadCount[channel.id]}
//                         </span>
//                       )}
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="p-4 py-[20px] border-t-2  border-white/15 mt-auto">
//           <div className="flex flex-col gap-1">
//             <div className="flex items-center justify-center gap-5">
//               <div className="flex items-center gap-2">
//                 <div className="text-lg md:text-xl font-extrabold tracking-tight text-[#01FFFF]">MumbleChat</div>
//               </div>
//               <div className="text-xs text-muted-foreground/80">v0.1.0</div>
//             </div>
//             <p className="text-xs text-center text-muted-foreground/60 leading-tight">
//               Decentralized messaging on Ramestta
//             </p>
//           </div>
//         </div>
//       </div>   
//       <NewChannelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
//     </>
//   );
// };

// export default Sidebar;


import { useChat } from '../../hooks/useChat';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Plus, Search, MoreVertical } from 'lucide-react';
import { useState, useMemo } from 'react';
import NewChannelModal from '../modals/NewChannelModal';
import { truncateAddress } from '../../utils/formatters';
import smsBg from '../../img/smsBg.jpg';
import { Store } from '../../Store/Store';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [showBlocked, setShowBlocked] = useState(false);

  const { blockAddress, unblockAddress, isBlocked } = Store();

  const activeChannelId = useMemo(() => {
    const path = location.pathname;
    const match = path.match(/\/chat\/([^/]+)/);
    return match ? match[1] : null;
  }, [location]);

  const uniqueChannels = useMemo(() => {
    const seen = new Set<string>();
    return channels.filter(channel => {
      const address = channel.id.toLowerCase();
      if (seen.has(address)) return false;
      seen.add(address);
      return true;
    });
  }, [channels]);

  const filteredChannels = useMemo(() => {
    if (!searchQuery) return uniqueChannels;
    const lowerQuery = searchQuery.toLowerCase();
    return uniqueChannels.filter(channel => {
      const fullId = channel.id.toLowerCase();
      const shortId = truncateAddress(channel.id, 4, 4).toLowerCase();
      return fullId.includes(lowerQuery) || shortId.includes(lowerQuery);
    });
  }, [searchQuery, uniqueChannels]);

  const handleSelectChannel = (channelId: string) => {
    setCurrentChannel?.(channelId);
    navigate(`/chat/${channelId}`);
    toggleSidebar();
  };

  const renderChannel = (channel: any) => {
    const address = channel.id.toLowerCase();
    const lastTwo = address.slice(-2).toUpperCase();
    const isActive = activeChannelId === channel.id;

    return (
      <li key={channel.id} className="relative">
        <div
          className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-colors ${
            isActive
              ? 'bg-white/15 text-[#0fff] border border-[#0fff]'
              : 'hover:bg-muted/30 text-foreground'
          }`}
        >
          <button
            onClick={() => handleSelectChannel(channel.id)}
            className="flex-1 text-left flex items-center gap-3"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full border border-[#0fff] bg-white/15 text-white text-xs font-semibold">
              {lastTwo}
            </div>
            <span className="truncate">{truncateAddress(channel.id, 4, 4)}</span>
          </button>

          <div className="relative">
            <button
              onClick={() =>
                setMenuOpenFor(prev => (prev === address ? null : address))
              }
              className="p-1.5 rounded hover:bg-muted/20"
              title="Options"
            >
              <MoreVertical size={18} />
            </button>

            {menuOpenFor === address && (
              <div className="absolute right-0 top-8 z-50 w-36 bg-white dark:bg-black border border-muted rounded shadow-lg">
                <button
                  onClick={() => {
                    isBlocked(address)
                      ? unblockAddress(address)
                      : blockAddress(address);
                    setMenuOpenFor(null);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-muted/30"
                >
                  {isBlocked(address) ? 'Unblock User' : 'Block User'}
                </button>
              </div>
            )}
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      <div
        className={`
          fixed inset-0 z-[50] h-full transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-[155%] md:w-64
          bg-white/20 dark:bg-black/20 backdrop-blur-lg border-r-2 border-white/15
          md:static md:translate-x-0 flex flex-col
        `}
        style={{ backgroundImage: `url(${smsBg})` }}
      >
        {/* Header */}
        <div className="p-3 border-b-2 border-white/15 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold tracking-tight text-[#01FFFF]">Chats</h2>
          <div className="flex gap-2 mr-6">
            <button onClick={() => setIsModalOpen(true)} className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground" aria-label="New Channel">
              <Plus size={26} className="font-bold" />
            </button>
            <button onClick={toggleSidebar} className="p-1.5 rounded-md hover:bg-muted/30 text-muted-foreground md:hidden" aria-label="Close sidebar">
              <ChevronLeft size={28} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b-2 border-white/15">
          <div className="flex items-center gap-2 bg-muted/20 px-3 py-[16.5px] rounded-md">
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full text-foreground"
            />
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 flex flex-col">
          {/* Scrollable unblocked list */}
          <div className="flex-1 overflow-y-auto py-2">
            {loading.channels ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="px-4 text-sm text-[#01FFFF] font-semibold mt-2 mb-1">📂 Chats</div>
                <ul className="space-y-1 px-2">
                  {filteredChannels
                    .filter(channel => !isBlocked(channel.id.toLowerCase()))
                    .map(renderChannel)}
                </ul>
              </>
            )}
          </div>

          {/* Blocked section (below scroll) */}
          {channels.some(ch => isBlocked(ch.id.toLowerCase())) && (
            <div className="px-3 pb-2 mt-2 border-t border-white/10 pt-2">
              <button
                onClick={() => setShowBlocked(prev => !prev)}
                className="w-full px-3 py-2 text-left text-sm font-semibold text-red-400 hover:bg-muted/20 transition rounded"
              >
                {showBlocked ? '🔼 Hide Blocked Users' : '🔽 Show Blocked Users'}
              </button>

              {showBlocked && (
                <ul className="space-y-1 mt-2 px-1">
                  {channels
                    .filter(channel => isBlocked(channel.id.toLowerCase()))
                    .map(renderChannel)}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 py-[20px] border-t-2 border-white/15 mt-auto">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-center gap-5">
              <div className="flex items-center gap-2">
                <div className="text-lg md:text-xl font-extrabold tracking-tight text-[#01FFFF]">MumbleChat</div>
              </div>
              <div className="text-xs text-muted-foreground/80">v0.1.0</div>
            </div>
            <p className="text-xs text-center text-muted-foreground/60 leading-tight">
              Decentralized messaging on Ramestta
            </p>
          </div>
        </div>
      </div>

      <NewChannelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Sidebar;






