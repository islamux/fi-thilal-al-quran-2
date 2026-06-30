import { useState } from 'react';
import type { Surah } from '../types';
<<<<<<< HEAD
import { TAFSIR_DATA } from '../data/tafsir';
=======
import { SURAHS_WITH_TAFSIR } from '../data/tafsir-meta';
import { loadTafsirData } from '../data/tafsir-loader';
>>>>>>> 914ff22 (feat: production readiness — security headers, code-split tafsir 18MB→230KB, cleanup)
import { getTafsirText } from '../utils/tafsir-data';

export function useTafsir() {
  const [tafsirText, setTafsirText] = useState<string | null>(null);
  const [verseRangeValue, setVerseRangeValue] = useState('كاملة');

  const fetchTafsir = async (surah: Surah, range = 'كاملة') => {
    setTafsirText(null);
    const data = await loadTafsirData();
    setTafsirText(getTafsirText(surah.id, data, range));
  };

  return {
    tafsirText,
    verseRangeValue,
    setVerseRangeValue,
    fetchTafsir,
    hasTafsir: (surahId: number) => !!TAFSIR_DATA[surahId],
  };
}
