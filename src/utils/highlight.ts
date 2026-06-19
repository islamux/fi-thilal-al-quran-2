export interface HighlightSegment {
  text: string;
  highlighted: boolean;
}

export function highlightText(text: string, query: string): HighlightSegment[] {
  if (!query.trim()) return [{ text, highlighted: false }];

  const words = query.trim().split(/\s+/).filter(Boolean);
  const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = escaped.join('|');

  const regex = new RegExp(`(${pattern})`, 'gi');
  const segments: HighlightSegment[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), highlighted: false });
    }
    if (segments.length > 0 && segments[segments.length - 1].highlighted) {
      segments[segments.length - 1].text += match[0];
    } else {
      segments.push({ text: match[0], highlighted: true });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), highlighted: false });
  }

  return segments.length > 0 ? segments : [{ text, highlighted: false }];
}
