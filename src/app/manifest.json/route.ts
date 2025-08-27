import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'DigiUnLim Cloud',
    short_name: 'DigiUnLim',
    description: 'Unlimited cloud storage with Telegram',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      }
    ]
  });
}