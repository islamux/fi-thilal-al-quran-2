# Search Result Highlighting — Design Spec

## Goal
Highlight matched keywords in ChatTab search result excerpts using the brand gold accent color.

## Constraints
- No changes to `search.ts` or `App.tsx`
- No `dangerouslySetInnerHTML`
- Search query is always available as `searchInput` in ChatTab

## Architecture

### `src/utils/highlight.ts`
**Exports:** `highlightText(text: string, query: string): Array<{ text: string; highlighted: boolean }>`

Splits `text` on query words using a case-insensitive regex. Each segment is either a matched word (`highlighted: true`) or non-matching text (`highlighted: false`). Query words are escaped for regex special characters.

Edge cases handled:
- Empty query → single segment with `highlighted: false`
- No matches → single segment with `highlighted: false`
- Multiple occurrences of same word → all highlighted
- Adjacent matches → merged into one highlighted segment
- Arabic text (no special treatment needed, regex works on any Unicode)

### `src/components/HighlightedText.tsx`
**Props:** `{ text: string; query: string }`

Renders the segments from `highlightText()`:
- Non-highlighted → plain text
- Highlighted → `<span className="bg-gilded-gold/20 text-gilded-gold font-medium">text</span>`

### `src/components/ChatTab.tsx` (modification)
Replace line 111-113:
```tsx
<p className="...">{match.excerpt}</p>
```
with:
```tsx
<HighlightedText text={match.excerpt} query={searchInput} />
```

The existing `line-clamp-3` and text sizing classes move to a wrapper `<div>` around `HighlightedText`.

## Testing
- `src/utils/highlight.test.ts` — unit tests for `highlightText()`:
  - Empty query
  - Single word match (once, multiple times)
  - Multi-word query with partial overlap
  - No matches
  - Case insensitivity with Arabic
  - Query with regex special characters
  - Query longer than text

## Files Created/Modified
| File | Action |
|------|--------|
| `src/utils/highlight.ts` | Create |
| `src/components/HighlightedText.tsx` | Create |
| `src/utils/highlight.test.ts` | Create |
| `src/components/ChatTab.tsx` | Modify (3 lines) |
