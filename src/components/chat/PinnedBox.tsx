// import { Store } from '../../Store/Store';
// import { RiUnpinFill } from "react-icons/ri";

// interface PinnedBoxProps {
//   channelId: string;
// }

// const PinnedBox = ({ channelId }: PinnedBoxProps) => {
//   const pinnedMessage = Store((state) => state.pinnedMessages[channelId]);
//   const unpinMessage = Store((state) => state.unpinMessage);

//   if (!pinnedMessage) return null;

//   return (
//     <div className="mb-2 bg-white/5 text-white rounded shadow">
//       {/* Header: Fixed title + unpin */}
//       <div className="flex justify-between items-center px-3 py-2 border-b border-white/10">
//         <p className="text-sm font-bold">📌 Pinned Message</p>
//         <button
//           onClick={() => unpinMessage(channelId)}
//           title="Unpin Message"
//           className="text-red-400 hover:text-red-500"
//         >
//           <RiUnpinFill className="text-xl" />
//         </button>
//       </div>

//       {/* Scrollable content */}
//       <div className="max-h-[100px] overflow-y-auto px-3 py-2">
//         <div className="bg-black rounded p-2">
//           <p className="text-sm whitespace-pre-wrap break-words">
//             {pinnedMessage.content.trim()}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PinnedBox;

import { Store } from '../../Store/Store';
import { RiUnpinFill } from "react-icons/ri";

interface PinnedBoxProps {
  channelId: string;
}

const PinnedBox = ({ channelId }: PinnedBoxProps) => {
  const pinnedMessage = Store((state) => state.pinnedMessages[channelId]);
  const unpinMessage = Store((state) => state.unpinMessage);
  const setScrollToMessageId = Store((state) => state.setScrollToMessageId);

  if (!pinnedMessage) return null;

  const handleClick = () => {
    setScrollToMessageId(pinnedMessage.id);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer mb-2 bg-white/5 text-white rounded shadow hover:bg-white/10 transition"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 border-b border-white/10">
        <p className="text-sm font-bold">📌 Pinned Message</p>
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent scroll trigger
            unpinMessage(channelId);
          }}
          title="Unpin Message"
          className="text-red-400 hover:text-red-500"
        >
          <RiUnpinFill className="text-xl" />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[100px] overflow-y-auto px-3 py-2">
        <div className="bg-black rounded p-2">
          <p className="text-sm whitespace-pre-wrap break-words">
            {pinnedMessage.content.trim()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PinnedBox;

