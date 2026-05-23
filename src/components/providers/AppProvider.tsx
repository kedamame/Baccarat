'use client';

import { type ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi';

// Initialize Farcaster SDK and set window.ethereum BEFORE WagmiProvider mounts
// so that the injected() connector detects the Farcaster wallet at connect time.
async function initFarcasterProvider(): Promise<void> {
  try {
    const { sdk } = await import('@farcaster/miniapp-sdk');
    const isMiniApp = await sdk.isInMiniApp();
    if (!isMiniApp) return;
    const ethProvider = await sdk.wallet.getEthereumProvider();
    if (ethProvider && typeof window !== 'undefined') {
      (window as unknown as Record<string, unknown>).ethereum = ethProvider;
    }
  } catch {
    // Not in Farcaster or SDK unavailable
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } }),
  );

  useEffect(() => {
    initFarcasterProvider().finally(() => setReady(true));
  }, []);

  // Delay WagmiProvider until Farcaster provider is resolved,
  // so the injected connector picks up the correct window.ethereum
  if (!ready) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          backgroundColor: '#ece8de',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
