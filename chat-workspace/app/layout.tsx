import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZoLaiGPT — Spatial Chat Preview',
  description: 'A liquid glass workspace preview. Local scripted responses; no live AI connection.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
