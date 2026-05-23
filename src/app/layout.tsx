import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/components/providers/AppProvider';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app';

const miniAppEmbed = {
  version: '1',
  imageUrl: `${APP_URL}/opengraph-image`,
  button: {
    title: 'Play Baccarat',
    action: {
      type: 'launch_miniapp',
      name: 'Baccarat',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: '#ece8de',
    },
  },
};

export const metadata: Metadata = {
  title: 'Baccarat',
  description: 'Single-player baccarat on Base. Record your score on-chain.',
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: 'Baccarat',
    description: 'Single-player baccarat on Base.',
    type: 'website',
    images: ['/og-image.png'],
  },
  other: {
    'fc:miniapp': JSON.stringify(miniAppEmbed),
    'base:app_id': '6a11829c355ac57b9a9b63e2',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="scanlines">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
