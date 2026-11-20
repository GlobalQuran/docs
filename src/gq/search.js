// Small hand-written index for the home page search box.
export const INDEX = [
  ['How it works', '/how-it-works', 'quran id ids ayah number global surah url audio explained start'],
  ['API', '/api', 'api key free sign in get key landing'],
  ['API reference', '/api/reference', 'endpoints reference surah ayah page juz complete list translation recitor'],
  ['Embed the reader', '/embed', 'embed reader iframe website snippet quran anywhere widget'],
  ['Download data', '/data', 'data download translation txt json jsonp zip files'],
  ['Audio', '/audio', 'audio mp3 ogg reciter recitor cdn verse surah url'],
  ['Assets', '/assets', 'fonts images ayah images logo'],
  ['Quran PDF', '/pdf', 'pdf print download whole quran'],
  ['AI instructions', '/ai-instructions', 'ai assistant chatgpt claude prompt build'],
  ['Donate', '/donate', 'donate donation support sadaqah wall donors'],
  ['About', '/about', 'about us team'],
  ['Contact', '/contact', 'contact email feedback'],
];
export function searchIndex(q) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return INDEX.filter(([t, , k]) => (t + ' ' + k).toLowerCase().includes(s)).slice(0, 6);
}
