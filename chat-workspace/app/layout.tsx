import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZOLAI GPT — Chat Demo',
  description: 'Explore the ZOLAI GPT workspace demo. English/Myanmar interface, local scripted replies, Markdown and code; no live AI connection.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
