// Only owner-provided website copy supplies product answers. No provider calls.
import { translations } from './source-translations.mjs';

export const prompts = [
  { title: 'A world of languages', text: 'Which languages does ZoLaiGPT focus on?', kind: 'languages', caption: 'English · Myanmar · Zomi' },
  { title: 'The vision behind it', text: 'Tell me about the ZoLaiGPT mission.', kind: 'mission', caption: 'Human possibility' },
  { title: 'What comes next?', text: 'What is the official app release status?', kind: 'app', caption: 'Verified updates only' },
  { title: 'Explore the interface', text: 'Show me a small JavaScript example.', kind: 'code', caption: 'Markdown & code preview' },
];

export function makeReply(text, language = 'en') {
  const copy = translations[language] || translations.en;
  if (/javascript|code|function|programming/i.test(text)) return '### A little clarity, in code\n\nThis is a **prewritten interface sample**, not generated AI output.\n\n```javascript\nconst languages = ["English", "Myanmar", "Zomi (Tedim)"];\n\nfunction welcome(language) {\n  return `Welcome to ZoLaiGPT · ${language}`;\n}\n\nconsole.log(welcome(languages[0]));\n```\n\nUse **Copy code**, or keep your own ideas in the canvas.';
  const key = /language|ဘာသာ|pau/i.test(text) ? 'f1d' : /mission|vision|about|purpose/i.test(text) ? 'aboutbody' : /app|release|download|launch/i.test(text) ? 'appdesc' : null;
  if (key) return `### ZoLaiGPT · Preview\n\n${copy[key]}\n\n---\n\n*Source: existing ZoLaiGPT website copy. Local demo reply.*`;
  return '### You’re in the preview\n\nThis workspace demonstrates the ZoLaiGPT chat experience with **prewritten replies**. It cannot answer general questions or analyse attachments with AI yet.\n\nTry a prompt about our **languages**, **mission**, or **app release status**. You can also explore a small **JavaScript example**.\n\nYour threads and attachments stay in this tab. Refreshing clears them.';
}

export function transcript(thread) {
  return `# ${thread.title}\n\nZoLaiGPT local demo · no live AI\n\n` + thread.messages.map(m => `## ${m.role === 'user' ? 'You' : 'ZoLaiGPT · Demo'}\n\n${m.content}`).join('\n\n');
}

export function safeAttachment(name, bytes) {
  return /\.(txt|md|json|csv)$/i.test(name) && bytes <= 100 * 1024;
}
