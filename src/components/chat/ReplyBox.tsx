import { Store } from '../../Store/Store';
import { IoCloseSharp } from "react-icons/io5";

interface ReplyBoxProps {
  channelId: string;
}

const ReplyBox = ({ channelId }: ReplyBoxProps) => {
  const replyMessage = Store((state) => state.replyMessages[channelId]);
  const clearReplyMessage = Store((state) => state.clearReplyMessage);
  const setScrollToMessageId = Store((state) => state.setScrollToMessageId);

  if (!replyMessage) return null;

  const handleClick = () => {
    setScrollToMessageId(replyMessage.id);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer mb-2 bg-white/5 text-white rounded shadow hover:bg-white/10 transition"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2 border-b border-white/10">
        <p className="text-sm font-bold">💬 Replying To</p>
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent scroll trigger
            clearReplyMessage(channelId);
          }}
          title="Cancel Reply"
          className="text-yellow-400 hover:text-yellow-500"
        >
          <IoCloseSharp className="text-xl" />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[100px] overflow-y-auto px-3 py-2">
        <div className="bg-black rounded p-2">
          <p className="text-sm whitespace-pre-wrap break-words">
            {replyMessage.content.trim()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReplyBox;
