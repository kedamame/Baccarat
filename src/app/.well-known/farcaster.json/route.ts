import { NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app';

export async function GET() {
  return NextResponse.json({
    accountAssociation: {
      header: 'REPLACE_WITH_WARPCAST_MANIFEST_TOOL_OUTPUT',
      payload: 'REPLACE_WITH_WARPCAST_MANIFEST_TOOL_OUTPUT',
      signature: 'REPLACE_WITH_WARPCAST_MANIFEST_TOOL_OUTPUT',
    },
    miniapp: {
      version: '1',
      name: 'Baccarat',
      subtitle: 'Single-player baccarat on Base',
      description: 'Play baccarat and record your score on-chain. Single-player card game built on Base.',
      homeUrl: APP_URL,
      iconUrl: `${APP_URL}/icon.png`,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: '#ece8de',
      heroImageUrl: `${APP_URL}/og-image.png`,
      ogTitle: 'Baccarat',
      ogDescription: 'Single-player baccarat on Base',
      ogImageUrl: `${APP_URL}/og-image.png`,
      screenshotUrls: [
        `${APP_URL}/screenshot1.png`,
        `${APP_URL}/screenshot2.png`,
        `${APP_URL}/screenshot3.png`,
      ],
      primaryCategory: 'games',
      tags: ['baccarat', 'casino', 'base', 'onchain', 'game'],
      tagline: 'Baccarat on Base',
      noindex: false,
      requiredChains: ['eip155:8453'],
      requiredCapabilities: [],
    },
  });
}
