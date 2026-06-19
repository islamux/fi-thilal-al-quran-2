import { splitVerseSegments } from '../utils/tafsir-format';

interface TafsirContentProps {
  paragraphs: string[];
  isDarkMode: boolean;
}

export function TafsirContent({ paragraphs, isDarkMode }: TafsirContentProps) {
  const textColor = isDarkMode ? 'text-[#d6d2ca]' : 'text-brand-rich';

  return paragraphs.map((para, i) => (
    <p key={i} className={textColor}>
      {splitVerseSegments(para).map((seg, j) => (
        <span key={j} className={seg.isVerse ? 'text-gilded-gold' : ''}>
          {seg.text}
        </span>
      ))}
    </p>
  ));
}
