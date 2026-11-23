import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Chat (Preview) — ZoLaiGPT',
  description: 'ZoLaiGPT AI Chat preview workspace. Local scripted demo replies; no live AI connection.',
  robots: { index: false, follow: false },
  icons: { icon: '/assets/brand/favicon-32.png', apple: '/assets/brand/apple-touch-icon.png' },
};

export const viewport: Viewport = { themeColor: '#06050b' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
