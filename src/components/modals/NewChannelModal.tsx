import { useState } from 'react';
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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const normalized = getAddress(input.trim()); // Validate Ethereum address
      setError('');

      // ✅ Create the channel
      if (createChannel) {
        await createChannel(normalized, 'Direct Chat', true);
      }

      // ✅ Set active channel and navigate
      if (setCurrentChannel) {
        setCurrentChannel(normalized);
      }

      navigate(`/chat/${normalized}`);
      onClose();
      setInput('');
    } catch {
      setError('❌ Invalid Ethereum address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-input border border-border rounded-lg shadow-lg slide-up">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-medium">Start a new chat</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="wallet-address" className="block text-sm font-medium mb-1">
              Recipient wallet address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Hash size={16} />
              </div>
              <input
                id="wallet-address"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input pl-10"
                placeholder="0x..."
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn btn-outline" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-t-transparent border-white animate-spin mr-2"></div>
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
