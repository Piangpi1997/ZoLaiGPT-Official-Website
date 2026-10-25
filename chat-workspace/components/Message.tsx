'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, RotateCcw, Volume2, ThumbsUp, ThumbsDown } from 'lucide-react';

export type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };

function CodeBlock({ children }: { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const [copyError,setCopyError] = useState(false);
  async function copy(e: React.MouseEvent<HTMLButtonElement>) {
    const code = e.currentTarget.closest('pre')?.querySelector('code')?.textContent || '';
    try { await navigator.clipboard.writeText(code); setCopyError(false); setCopied(true); setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); setCopyError(true); }
  }
  return <pre className="code-panel"><div className="code-header"><span>CODE SAMPLE</span><button onClick={copy} aria-label="Copy code">{copied ? <Check size={13}/> : <Copy size={13}/>} {copied ? 'Copied' : copyError ? 'Select text to copy' : 'Copy code'}</button></div>{children}</pre>;
}

export default function Message({ message, streaming, onRetry, notify }: { message: ChatMessage; streaming: boolean; onRetry: () => void; notify: (s: string) => void }) {
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  async function copy() {
    try { await navigator.clipboard.writeText(message.content); notify('Reply copied.'); }
    catch { notify('Copy is unavailable. Select the reply text to copy it.'); }
  }
  function read() {
    if (!('speechSynthesis' in window)) { notify('Read aloud is unavailable in this browser.'); return; }
    if (speechSynthesis.speaking) { speechSynthesis.cancel(); notify('Read aloud stopped.'); return; }
    const utterance = new SpeechSynthesisUtterance(message.content.replace(/[#*`]/g, ''));
    utterance.onend = () => notify('Read aloud finished.');
    utterance.onerror = () => notify('Read aloud could not start.');
    speechSynthesis.speak(utterance); notify('Reading this demo reply. Press Read aloud again to stop.');
  }
  return <article className={`message message-${message.role}`}>
    {message.role === 'assistant' && <div className="message-identity"><img src="/logo.png" alt="" width="25" height="25"/><span>ZoLaiGPT <small>PREVIEW</small></span></div>}
    <div className="message-body">
      {message.role === 'user' ? <p className="whitespace-pre-wrap">{message.content}</p> : <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ pre: CodeBlock, a: ({children, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer">{children}</a>, code: ({children, className}) => {
        const text = String(children);
        if (!className) return <code>{children}</code>;
        return <code className={className}>{text.split(/("[^"\n]*"|'[^'\n]*'|\b(?:const|function|return|console|log)\b)/g).map((part,i) => <span key={i} className={/^['"]/.test(part) ? 'token-string' : /^(const|function|return)$/.test(part) ? 'token-keyword' : /^(console|log)$/.test(part) ? 'token-name' : undefined}>{part}</span>)}</code>;
      } }}>{message.content}</ReactMarkdown>{streaming && <span className="stream-caret" aria-hidden="true"/>}</div>}
    </div>
    {message.role === 'assistant' && !streaming && message.content && <div className="message-actions" aria-label="Reply actions">
      <button onClick={copy} aria-label="Copy reply" title="Copy reply"><Copy size={15}/></button>
      <button onClick={onRetry} aria-label="Replay demo reply" title="Replay demo reply"><RotateCcw size={15}/></button>
      <span className="action-divider"/>
      <button onClick={() => { setVote(vote === 'up' ? null : 'up'); notify('Feedback kept locally for this preview.'); }} aria-pressed={vote === 'up'} aria-label="Helpful reply" title="Helpful reply"><ThumbsUp size={15}/></button>
      <button onClick={() => { setVote(vote === 'down' ? null : 'down'); notify('Feedback kept locally for this preview.'); }} aria-pressed={vote === 'down'} aria-label="Unhelpful reply" title="Unhelpful reply"><ThumbsDown size={15}/></button>
      <button onClick={read} aria-label="Read aloud" title="Read aloud"><Volume2 size={15}/></button>
      <span className="demo-reply-label">Scripted preview</span>
    </div>}
  </article>;
}
