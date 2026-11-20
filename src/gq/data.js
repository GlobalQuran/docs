import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuranData } from '../store/slices/quranSlice';
import { API } from './ui';

/** The list of every text and reciter, from the existing redux store (cached 5 minutes). */
export function useQuranList() {
  const dispatch = useDispatch();
  const { textFormats, audioFormats, loading, error, lastFetched } = useSelector((s) => s.quran);
  useEffect(() => {
    const stale = !lastFetched || Date.now() - lastFetched > 5 * 60 * 1000;
    if ((textFormats.length === 0 && audioFormats.length === 0) || stale) dispatch(fetchQuranData());
  }, [dispatch, textFormats.length, audioFormats.length, lastFetched]);
  return { textFormats, audioFormats, loading, error };
}

let surahCache = null;
/** 114 surahs with ayah counts and the global number where each starts. */
export function useSurahs() {
  const [list, setList] = useState(surahCache || []);
  useEffect(() => {
    if (surahCache) return;
    fetch(`${API}/surah`).then((r) => r.json()).then((j) => {
      const arr = Object.values(j.surahList || {}).sort((a, b) => a.surah_number - b.surah_number);
      surahCache = arr; setList(arr);
    }).catch(() => {});
  }, []);
  return list;
}

export const FALLBACK_COUNTS = { texts: 97, reciters: 193, quran: 12 };
