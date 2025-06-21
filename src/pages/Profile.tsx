import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useChat } from '../hooks/useChat';
import { User, Save, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { truncateAddress } from '../utils/formatters';  // ✅ Correct relative path

const Profile = () => {
  const { address, balance } = useWallet();
  const { users, updateUserProfile } = useChat();
  
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (address && users[address]) {
      const userProfile = users[address];
      setDisplayName(userProfile.displayName || '');
      setAvatar(userProfile.avatar || '');
    }
  }, [address, users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    try {
      setIsSaving(true);
      await updateUserProfile(displayName, avatar);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const copyAddressToClipboard = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-lg font-medium">{displayName || 'Set your display name'}</h2>
              </div>
            </div>

            {address && (
              <div className="text-sm text-muted-foreground text-right">
                {truncateAddress(address)}
                <button
                  onClick={copyAddressToClipboard}
                  className="ml-3 btn btn-outline btn-xs"
                  disabled={!address}
                >
                  {copySuccess ? 'Copied' : (<><Copy size={12} className="mr-1" /> Copy</>)}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background rounded-md border border-border">
            <div><p className="text-sm text-muted-foreground mb-1">Balance</p><p className="font-medium">{balance} RAMA</p></div>
            <div><p className="text-sm text-muted-foreground mb-1">Network</p><p className="font-medium">Ramestta Mainnet</p></div>
            <div><p className="text-sm text-muted-foreground mb-1">Status</p><div className="flex items-center"><div className="h-2 w-2 rounded-full bg-success mr-2"></div><p className="font-medium">Online</p></div></div>
            <div><p className="text-sm text-muted-foreground mb-1">View on Explorer</p><a href={`https://ramascan.com/${address}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">View transactions<ExternalLink size={14} className="ml-1" /></a></div>
          </div>
        </div>

        {/* <div className="card">
          <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="displayName" className="block text-sm font-medium mb-1">Display Name</label>
              <input id="displayName" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input" placeholder="Enter your display name" />
              <p className="text-xs text-muted-foreground mt-1">This is how you'll appear to others in the chat.</p>
            </div>

            <div className="mb-6">
              <label htmlFor="avatar" className="block text-sm font-medium mb-1">Avatar URL</label>
              <input id="avatar" type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} className="input" placeholder="https://example.com/avatar.jpg" />
              <p className="text-xs text-muted-foreground mt-1">Enter a URL to your avatar image. Leave blank to use default.</p>
            </div>

            {saveSuccess && <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-md text-sm text-success">Profile updated successfully!</div>}

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? (<><div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>Saving...</>) : (<><Save size={16} className="mr-2" />Save Profile</>)}
              </button>
            </div>
          </form>
        </div> */}
      </motion.div>
    </div>
  );
};

export default Profile;
