import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAddress } from 'ethers';
import { useChatContext } from '../../context/ChatContext';
import { X, Hash } from 'lucide-react';

interface NewChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewChannelModal = ({ isOpen, onClose }: NewChannelModalProps) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { createChannel, setCurrentChannel } = useChatContext();

  useEffect(() => {
    if (!isOpen) {
      setInput('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const normalized = getAddress(input.trim());
      setError('');

      if (createChannel) await createChannel(normalized, 'Direct Chat', true);
      if (setCurrentChannel) setCurrentChannel(normalized);

      navigate(`/chat/${normalized}`);
      onClose();
    } catch {
      setError('❌ Invalid Ethereum address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 w-[150%] md:w-full lg:w-full">
    <div className="fixed inset-0 z-[9999] w-[100vw] h-[100vh] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md bg-white/20 dark:bg-gray-900/30 text-gray-800 dark:text-gray-100
        border border-white/20 dark:border-gray-700 rounded-2xl shadow-2xl backdrop-blur-xl
        transform transition-all duration-300 animate-fade-in-up`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/20 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Start New Chat</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/40 transition-colors"
            aria-label="Close modal"
          >
            <X size={30} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label htmlFor="wallet-address" className="block text-sm font-medium mb-2">
              Recipient Wallet Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Hash size={16} />
              </span>
              <input
                id="wallet-address"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border 
                ${isLoading ? 'opacity-70' : ''}
                bg-white/20 dark:bg-gray-800/50 
                border-white/20 dark:border-gray-700 
                focus:ring-2 focus:ring-[#0fff] focus:outline-none 
                transition-all duration-200`}
                placeholder="0x..."
                disabled={isLoading}
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg 
              bg-white/30 dark:bg-gray-800/40 
              border border-white/30 hover-border hover:border-[#0fff] dark:border-gray-700 
              text-gray-700 dark:text-gray-300 
              hover:bg-white/50 dark:hover:bg-gray-700/60 
              transition-all focus:outline-none focus:ring-2 focus:ring-white/50 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2.5 text-sm font-medium rounded-lg text-black 
              bg-[#0fff] hover:bg-[#1fff] shadow-xl transition-all 
              focus:outline-none focus:ring-2 focus:ring-[#0fff]/50 
              flex items-center justify-center 
              ${isLoading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                      5.291A7.962 7.962 0 014 12H0c0 
                      3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Starting...
                </>
              ) : (
                'Start Chat'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewChannelModal;
