# Testing — في ظلال القرآن

## Stack

- **Vitest 4** — test runner
- **Testing Library** (`@testing-library/react` + `@testing-library/jest-dom`) — DOM assertions
- **jsdom** — browser environment for component/hook tests

All test files are **colocated** with their source: `src/utils/search.ts` → `src/utils/search.test.ts`.

## Running Tests

```bash
pnpm test          # Run once
pnpm test:watch    # Watch mode
```

## Test Suite (103 tests, 10 files)

| File | Tests | What it covers |
|------|-------|----------------|
| `utils/tafsir-format.test.ts` | 32 | Paragraph splitting from raw `.doc` text — keyword detection, punctuation heuristics, edge cases |
| `utils/search.test.ts` | 12 | Word-matching across sections, scoring, excerpt generation, empty query |
| `utils/localStorage.test.ts` | 11 | `get`, `set`, `remove`, `clear`, `onChange` callbacks |
| `utils/syncBackend.test.ts` | 11 | Supabase sync — push, pull, merge, conflict resolution |
| `utils/highlight.test.ts` | 10 | `highlightText()` — split, multi-word, Arabic, no-match |
| `utils/tafsir-data.test.ts` | 8 | `getTafsirText()` — full surah, verse range, missing surah |
| `components/QuickSearch.test.tsx` | 5 | Renders buttons, click triggers search callback |
| `components/SectionSelector.test.tsx` | 5 | Renders sections, selection changes value, empty state |
| `components/TafsirDisplay.test.tsx` | 4 | Renders paragraphs, highlights ayah text, handles null |
| `utils/index.test.ts` | 5 | `toArabicNumerals()` — number conversion, edge cases |

## Test Patterns

### Pure function tests (no React)

The simplest pattern — import a function, call it, assert the result:

```ts
// src/utils/search.test.ts
import { describe, it, expect } from 'vitest'
import { searchTafsir } from './search'

describe('searchTafsir', () => {
  it('returns empty array for empty query', () => {
    expect(searchTafsir('', {}, new Map())).toEqual([])
  })

  it('finds matching sections', () => {
    const data = { 1: [{ startVerse: 1, endVerse: 1, text: 'نص عربي للبحث' }] }
    const result = searchTafsir('عربي', data, new Map([[1, 'الفاتحة']]))
    expect(result).toHaveLength(1)
    expect(result[0].surahName).toBe('الفاتحة')
  })
})
```

### Hook tests (with `renderHook`)

Tests that exercise React hooks without mounting a full component:

```ts
// src/utils/localStorage.test.ts
import { renderHook, act } from '@testing-library/react'
import { useBookmarks } from './useBookmarks'

describe('useBookmarks', () => {
  beforeEach(() => localStorage.clear())

  it('toggles bookmark', () => {
    const { result } = renderHook(() => useBookmarks())
    act(() => result.current.toggleBookmark(1))
    expect(result.current.isBookmarked(1)).toBe(true)
  })
})
```

### Component tests (with `render` + `screen`)

Tests that render a component and assert on the DOM:

```tsx
// src/components/QuickSearch.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuickSearch } from './QuickSearch'

it('triggers search when button clicked', async () => {
  const onSearch = vi.fn()
  render(<QuickSearch onSearch={onSearch} />)
  await userEvent.click(screen.getByText('التوحيد'))
  expect(onSearch).toHaveBeenCalledWith('التوحيد')
})
```

## Lint Pass

```bash
pnpm run lint    # tsc --noEmit — must exit 0
```

Before committing, always run both `pnpm run lint` and `pnpm test` to verify no type errors and no regressions.
