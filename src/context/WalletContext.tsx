import { createContext, useReducer, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
import { ethers, Signer } from 'ethers';
import { WalletState, WalletContextType } from '../types/wallet'; // Ensure path is correct

// Initial state for the wallet context
const initialState: WalletState = {
  address: null,
  connected: false,
  connecting: false,
  error: null,
  balance: '0',
  network: null,
  signer: null,
};

// Define actions for the wallet reducer
type WalletAction =
  | { type: 'CONNECT_START' }
  | { type: 'CONNECT_SUCCESS'; payload: { address: string; balance: string; network: { id: number; name: string }; signer: Signer } }
  | { type: 'CONNECT_ERROR'; payload: string }
  | { type: 'DISCONNECT' }
  | { type: 'UPDATE_BALANCE'; payload: string };

// Reducer function to manage wallet state changes
const walletReducer = (state: WalletState, action: WalletAction): WalletState => {
  switch (action.type) {
    case 'CONNECT_START':
      return { ...state, connecting: true, error: null };
    case 'CONNECT_SUCCESS':
      return {
        ...state,
        address: action.payload.address,
        balance: action.payload.balance,
        network: action.payload.network,
        connected: true,
        connecting: false,
        error: null,
        signer: action.payload.signer,
      };
    case 'CONNECT_ERROR':
      return { ...state, connecting: false, error: action.payload, address: null, signer: null };
    case 'DISCONNECT':
      return initialState;
    case 'UPDATE_BALANCE':
      return { ...state, balance: action.payload };
    default:
      return state;
  }
};

// Create the React Context for the wallet
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// WalletProvider component to wrap your application and provide wallet functionality
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);
  const autoConnectAttempted = useRef(false); // Flag to ensure auto-connect runs only once per app load

  // Memoized connect function
  const connect = useCallback(async () => {
    if (state.connected || state.connecting) {
        console.log("WalletContext: Connect call ignored (already connected or connecting).");
        return;
    }

    dispatch({ type: 'CONNECT_START' });

    if (!window.ethereum) {
      dispatch({
        type: 'CONNECT_ERROR',
        payload: 'MetaMask not detected. Please install MetaMask to proceed.',
      });
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log("WalletContext: Requesting Ethereum accounts...");
      const accounts = await provider.send('eth_requestAccounts', []);
      const connectedAddress = accounts[0];

      const walletSigner = await provider.getSigner(connectedAddress);
      console.log("WalletContext: Signer obtained:", await walletSigner.getAddress());

      const balance = await provider.getBalance(connectedAddress);
      const network = await provider.getNetwork();

      dispatch({
        type: 'CONNECT_SUCCESS',
        payload: {
          address: connectedAddress,
          balance: ethers.formatEther(balance),
          network: { id: Number(network.chainId), name: network.name },
          signer: walletSigner,
        },
      });
      console.log("WalletContext: Wallet connected successfully!");
    } catch (error: any) {
      console.error('WalletContext: Wallet connection error:', error);
      if (error.code === 4001) {
        dispatch({
          type: 'CONNECT_ERROR',
          payload: 'Wallet connection rejected by the user. Please approve in MetaMask.',
        });
      } else {
        dispatch({
          type: 'CONNECT_ERROR',
          payload: `Failed to connect to MetaMask: ${error.message || 'Unknown error'}. Please try again.`,
        });
      }
    }
  }, [state.connected, state.connecting]); // state.connected and state.connecting are used here

  // Memoized disconnect function
  const disconnect = useCallback(() => {
    console.log("WalletContext: Disconnecting wallet...");
    dispatch({ type: 'DISCONNECT' });
  }, []);

  // Memoized signMessage function
  const signMessage = useCallback(async (message: string): Promise<string | null> => {
    if (!state.connected || !state.signer || !state.address) {
      dispatch({
        type: 'CONNECT_ERROR',
        payload: 'Wallet not connected or signer not available. Please connect your wallet first.',
      });
      return null;
    }

    try {
      console.log("WalletContext: Signing message with connected signer...");
      const signature = await state.signer.signMessage(message);
      return signature;
    } catch (error) {
      console.error('WalletContext: Error signing message:', error);
      if ((error as any).code === 4001) {
          dispatch({
              type: 'CONNECT_ERROR',
              payload: 'Message signing rejected by the user. Please approve in MetaMask.',
          });
      } else {
          dispatch({
              type: 'CONNECT_ERROR',
              payload: 'Failed to sign message. Please try again.',
          });
      }
      return null;
    }
  }, [state.connected, state.signer, state.address]); // state.connected, state.signer, state.address are used here

  // Effect for auto-connecting on page load
  useEffect(() => {
    if (!autoConnectAttempted.current && window.ethereum) {
      autoConnectAttempted.current = true;
      
      const performAutoConnect = async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts(); 
          if (accounts.length > 0) {
            console.log("WalletContext: Auto-connecting wallet (accounts found)...");
            await connect();
          } else {
              console.log("WalletContext: No accounts pre-connected for auto-connect.");
          }
        } catch (error) {
          console.error("WalletContext: Auto-connect failed:", error);
        }
      };
      performAutoConnect();
    }
  }, [connect]); // Dependency: 'connect' function

  // Effect to listen for MetaMask account and chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('WalletContext: MetaMask accountsChanged event:', accounts);
        if (accounts.length === 0) {
          console.log('WalletContext: MetaMask accounts disconnected. Triggering disconnect.');
          disconnect();
        } else if (state.address && accounts[0].toLowerCase() !== state.address.toLowerCase()) {
          console.log('WalletContext: MetaMask account changed. Reconnecting...');
          connect();
        } else if (!state.connected && accounts.length > 0) {
            console.log('WalletContext: MetaMask unlocked or accounts re-enabled. Attempting connect.');
            connect();
        }
      };

      const handleChainChanged = () => {
        console.log('WalletContext: MetaMask network changed. Reconnecting...');
        connect();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [connect, disconnect, state.address, state.connected]); // Dependencies for listeners

  return (
    <WalletContext.Provider
      value={{
        ...state,
        connect,
        disconnect,
        signMessage,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to consume the WalletContext
export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
