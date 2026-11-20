// The API reference, written by hand from www-API (api.yaml). Keep in sync with api.yaml.
export const GROUPS = [
  { id: 'lists', title: 'Lists', blurb: 'What you can choose from.' },
  { id: 'read', title: 'Read', blurb: 'Give me this part, in this text. Add several texts with commas: en.sahih,ar.uthmani' },
  { id: 'complete', title: 'Complete text', blurb: 'The whole Quran in one text. Best for apps that keep a copy.' },
  { id: 'audio', title: 'Audio', blurb: 'The API tells you which reciters exist. The audio itself is plain files on our CDN (no key): you build the address from the reciter, the format and the ayah or surah number. The Audio page explains it step by step and lets you play.' },
];

// Records of the Audio group that are not API calls. Each opens the page given in `to`.
export const AUDIO_RECORDS = [
  { title: 'List reciters', path: '/v2/list/recitor', to: '/api/reference/list-recitor' },
  { title: 'Audio file, verse by verse', path: 'https://audio.globalquran.com/{reciter}/{format}/{kbs}kbs/{ayah}.mp3', to: '/audio', method: 'FILE' },
  { title: 'Audio file, surah by surah', path: 'https://audio.globalquran.com/{reciter}/{format}/{kbs}kbs/surah/{surah}.mp3', to: '/audio', method: 'FILE' },
];

export const ENDPOINTS = [
  {
    slug: 'list-translation', group: 'lists', path: '/v2/list/translation', title: 'List translations',
    summary: 'All translations, with their IDs, language and translator.',
    params: [],
    sample: '/v2/list/translation',
    note: 'Use the IDs it returns (like en.sahih) in the Read endpoints.',
  },
  {
    slug: 'list-recitor', group: 'lists', path: '/v2/list/recitor', title: 'List reciters',
    summary: 'All reciters and the audio files each one has (format, bit rate, mode, folder).',
    params: [],
    sample: '/v2/list/recitor',
    note: 'The folder in each entry plus the ayah number gives the audio address. See Audio.',
  },
  {
    slug: 'list-quran', group: 'lists', path: '/v2/list/quran', title: 'List Arabic texts',
    summary: 'All Arabic Quran texts (Uthmani, simple, tajweed and more).',
    params: [],
    sample: '/v2/list/quran',
  },
  {
    slug: 'surah-list', group: 'lists', path: '/v1/surah', title: 'List surahs',
    summary: 'All 114 surahs: names, ayah count, and the global ayah number where each starts and ends.',
    params: [],
    sample: '/v1/surah',
    note: 'start_ayah and end_ayah are global numbers. Use them to turn surah:ayah into one number.',
  },
  {
    slug: 'ayah', group: 'read', path: '/v1/ayah/{ayah}/{quranId}', title: 'One ayah',
    summary: 'Get one ayah in the text you choose.',
    params: [
      ['ayah', 'Global number (262) or surah:ayah (2:255)'],
      ['quranId', 'Text to return, e.g. en.sahih. Several: en.sahih,ar.uthmani'],
    ],
    sample: '/v1/ayah/262/en.sahih',
  },
  {
    slug: 'surah', group: 'read', path: '/v1/surah/{surah}/{quranId}', title: 'One surah',
    summary: 'Every ayah of a surah.',
    params: [
      ['surah', 'Surah number, 1 to 114'],
      ['quranId', 'Text to return, e.g. en.sahih'],
    ],
    sample: '/v1/surah/1/en.sahih',
  },
  {
    slug: 'page', group: 'read', path: '/v1/page/{page}/{quranId}', title: 'One page',
    summary: 'The ayahs on one mushaf page.',
    params: [
      ['page', 'Page number, 1 to 604'],
      ['quranId', 'Text to return, e.g. en.sahih'],
    ],
    sample: '/v1/page/1/en.sahih',
  },
  {
    slug: 'juz', group: 'read', path: '/v1/juz/{juz}/{quranId}', title: 'One juz',
    summary: 'Every ayah of a juz.',
    params: [
      ['juz', 'Juz number, 1 to 30'],
      ['quranId', 'Text to return, e.g. en.sahih'],
    ],
    sample: '/v1/juz/30/en.sahih',
  },
  {
    slug: 'complete', group: 'complete', path: '/v1/complete/{quranId}', title: 'Complete text',
    summary: 'All 6,236 ayahs of one text. Add .json, .jsonp or leave it off for plain text.',
    params: [['quranId', 'Text to return, e.g. en.sahih (or en.sahih.json)']],
    sample: '/v1/complete/en.sahih.json',
    note: 'Big response. Keep a copy in your app instead of asking every time.',
  },
  {
    slug: 'all', group: 'complete', path: '/v1/all/{type}/{number}/{quranId}/{lang}', title: 'Everything in one request',
    summary: 'Text and extras for a surah, page, juz or ayah in a single call.',
    params: [
      ['type', 'surah, page, juz or ayah'],
      ['number', 'The number for that type (or surah:ayah)'],
      ['quranId', 'One or more texts, comma or pipe separated'],
      ['lang', 'Language code for language-specific data, e.g. en'],
    ],
    sample: '/v1/all/surah/1/en.sahih/en',
  },
];

export const bySlug = (s) => ENDPOINTS.find((e) => e.slug === s);
