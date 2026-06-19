# Search Result Highlighting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Highlight matched search keywords in ChatTab excerpts using gold accent.

**Architecture:** A pure utility function `highlightText()` splits text into matched/unmatched segments; a `HighlightedText` component renders them with gold styling; `ChatTab` swaps its plain `<p>` for the new component.

**Tech Stack:** TypeScript, React 19, Vitest

---

### Task 1: Create `highlightText()` utility + tests

**Files:**
- Create: `src/utils/highlight.ts`
- Create: `src/utils/highlight.test.ts`

- [ ] **Step 1: Create `src/utils/highlight.ts`**

```ts
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
    // Merge consecutive matches
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
```

- [ ] **Step 2: Create `src/utils/highlight.test.ts`**

```ts
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
      { text: '', highlighted: true },
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
      { text: '', highlighted: true },
      { text: ' القرآن', highlighted: false },
    ]);
  });

  it('returns empty array for empty text', () => {
    const result = highlightText('', 'test');
    expect(result).toEqual([{ text: '', highlighted: false }]);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail (no implementation yet)**

Run: `npx vitest run src/utils/highlight.test.ts`
Expected: FAIL — module not found

- [ ] **Step 4: Create `src/utils/highlight.ts`** (as written in Step 1)

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/utils/highlight.test.ts`
Expected: 10 tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/utils/highlight.ts src/utils/highlight.test.ts
git commit -m "feat(utils): add highlightText for search keyword highlighting"
```

---

### Task 2: Create `HighlightedText` component

**Files:**
- Create: `src/components/HighlightedText.tsx`

- [ ] **Step 1: Create `src/components/HighlightedText.tsx`**

```tsx
import { highlightText } from '../utils/highlight';

interface HighlightedTextProps {
  text: string;
  query: string;
}

export function HighlightedText({ text, query }: HighlightedTextProps) {
  const segments = highlightText(text, query);

  return (
    <>
      {segments.map((seg, i) =>
        seg.highlighted ? (
          <span key={i} className="bg-gilded-gold/20 text-gilded-gold font-medium">
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}
```

- [ ] **Step 2: Verify lint passes**

Run: `pnpm run lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/HighlightedText.tsx
git commit -m "feat(ui): add HighlightedText component for search results"
```

---

### Task 3: Update `ChatTab` to use `HighlightedText`

**Files:**
- Modify: `src/components/ChatTab.tsx:111-113`

- [ ] **Step 1: Add import**

Add to top of `ChatTab.tsx`: `import { HighlightedText } from './HighlightedText';`

- [ ] **Step 2: Replace excerpt `<p>` with `HighlightedText`**

Replace:
```tsx
            <p className={`text-xs leading-relaxed font-serif ${isDarkMode ? 'text-brand-dark-mute' : 'text-brand-faded'} line-clamp-3`}>
              {match.excerpt}
            </p>
```

With:
```tsx
            <div className={`text-xs leading-relaxed font-serif line-clamp-3 ${isDarkMode ? 'text-brand-dark-mute' : 'text-brand-faded'}`}>
              <HighlightedText text={match.excerpt} query={searchInput} />
            </div>
```

- [ ] **Step 3: Run lint + tests**

Run: `pnpm run lint && pnpm test`
Expected: All passing

- [ ] **Step 4: Commit**

```bash
git add src/components/ChatTab.tsx
git commit -m "feat(ui): use HighlightedText in ChatTab search results"
```

---

### Task 4: Final verification

- [ ] **Step 1: Full verification**

Run: `pnpm test && pnpm run lint && pnpm run build`
Expected: All tests pass, tsc clean, build succeeds

- [ ] **Step 2: Push branch and create PR**

```bash
git push -u origin feature/search-highlighting
gh pr create --title "feat: highlight matched keywords in search results" --body "## Summary
- Added \`highlightText()\` utility to split text into matched/unmatched segments
- Created \`HighlightedText\` component with gold accent styling
- Updated ChatTab search results to highlight query keywords

## Test Plan
- [x] 10 unit tests for edge cases
- [x] \`tsc --noEmit\` clean
- [x] Production build succeeds"
```
