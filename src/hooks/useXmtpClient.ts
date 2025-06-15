import { useState, useEffect } from 'react';
import { Client } from '@xmtp/xmtp-js';
import { useWallet } from './useWallet';

export function useXmtpClient() {
  const { connected, address, signer, error: walletError } = useWallet();

  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [isLoadingXmtp, setIsLoadingXmtp] = useState(true);
  const [xmtpError, setXmtpError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initXmtp = async () => {
      console.log("XMTP: Initializing. Connected:", connected, "Signer available:", !!signer);

      if (!connected || !signer) {
        setIsLoadingXmtp(false);
        setXmtpClient(null);
        if (!connected && walletError) {
          setXmtpError(walletError);
        } else {
          setXmtpError("Wallet not connected.");
        }
        return;
      }

      try {
        setIsLoadingXmtp(true);
        setXmtpError(null);

        const signerAddress = await signer.getAddress();

        const client = await Client.create(signer, { env: 'production' });

        if (isMounted) {
          setXmtpClient(client);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("XMTP Client error:", err);
        setXmtpError(err.message || "Unknown error");
        setXmtpClient(null);
      } finally {
        if (isMounted) {
          setIsLoadingXmtp(false);
        }
      }
    };

    initXmtp();
    return () => { isMounted = false; };
  }, [connected, signer, walletError, address]);

  return { xmtpClient, isLoadingXmtp, xmtpError };
}
