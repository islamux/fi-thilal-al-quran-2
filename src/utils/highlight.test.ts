import { describe, it, expect } from 'vitest';
import { highlightText } from './highlight';

describe('highlightText', () => {
  it('returns single segment with highlighted=false for empty query', () => {
    const result = highlightText('some text', '');
    expect(result).toEqual([{ text: 'some text', highlighted: false }]);
  });

  it('returns single segment with highlighted=false when no match', () => {
    const result = highlightText('some text', 'xyz');
    expect(result).toEqual([{ text: 'some text', highlighted: false }]);
  });

  it('highlights a single matching word', () => {
    const result = highlightText('بحث في الظلال', 'الظلال');
    expect(result).toEqual([
      { text: 'بحث في ', highlighted: false },
      { text: 'الظلال', highlighted: true },
    ]);
  });

  it('highlights multiple occurrences of the same word', () => {
    const result = highlightText('الظلال في الظلال', 'الظلال');
    expect(result).toEqual([
      { text: 'الظلال', highlighted: true },
      { text: ' في ', highlighted: false },
      { text: 'الظلال', highlighted: true },
    ]);
  });

  it('highlights multiple different query words', () => {
    const result = highlightText('بحث في الظلال القرآن', 'الظلال القرآن');
    expect(result).toEqual([
      { text: 'بحث في ', highlighted: false },
      { text: 'الظلال', highlighted: true },
      { text: ' ', highlighted: false },
      { text: 'القرآن', highlighted: true },
    ]);
  });

  it('is case-insensitive for Arabic', () => {
    const result = highlightText('ALLAH', 'allah');
    expect(result).toHaveLength(1);
    expect(result[0].highlighted).toBe(true);
  });

  it('handles regex special characters in query', () => {
    const result = highlightText('price is 10$', '10$');
    expect(result).toEqual([
      { text: 'price is ', highlighted: false },
      { text: '10$', highlighted: true },
    ]);
  });

  it('returns single non-highlighted segment when query is longer than text', () => {
    const result = highlightText('short', 'this is a very long query');
    expect(result).toEqual([{ text: 'short', highlighted: false }]);
  });

  it('handles adjacent matching words', () => {
    const result = highlightText('في ظلال القرآن', 'في ظلال');
    expect(result).toEqual([
      { text: 'في', highlighted: true },
      { text: ' ', highlighted: false },
      { text: 'ظلال', highlighted: true },
      { text: ' القرآن', highlighted: false },
    ]);
  });

  it('returns single non-highlighted segment for empty text', () => {
    const result = highlightText('', 'test');
    expect(result).toEqual([{ text: '', highlighted: false }]);
  });
});
