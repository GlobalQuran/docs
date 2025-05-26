import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch Quran data from API
export const fetchQuranData = createAsyncThunk(
  'quran/fetchQuranData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.globalquran.com/quran');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.quranList || {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const quranSlice = createSlice({
  name: 'quran',
  initialState: {
    data: {},
    textFormats: [],
    audioFormats: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuranData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuranData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = Date.now();
        
        // Process and separate text and audio formats
        const textFormats = [];
        const audioFormats = [];
        
        Object.entries(action.payload).forEach(([key, value]) => {
          const processedItem = {
            id: key,
            language: value.language_code,
            name: value.english_name,
            localName: value.native_name,
            type: value.type,
            source: value.source,
            lastUpdate: value.last_update,
            format: value.format
          };
          
          if (value.format === 'text') {
            textFormats.push(processedItem);
          } else if (value.format === 'audio') {
            let media = {};
            try {
              media = typeof value.media === 'string' ? JSON.parse(value.media) : value.media;
            } catch (e) {
              console.warn(`Could not parse media for ${key}:`, e);
              media = {};
            }
            processedItem.media = media;
            audioFormats.push(processedItem);
          }
        });
        
        // Sort the formats
        state.textFormats = textFormats.sort((a, b) => {
          if (a.language !== b.language) {
            return a.language.localeCompare(b.language);
          }
          return a.name.localeCompare(b.name);
        });
        
        state.audioFormats = audioFormats.sort((a, b) => a.name.localeCompare(b.name));
      })
      .addCase(fetchQuranData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch Quran data';
      });
  },
});

export const { clearError } = quranSlice.actions;
export default quranSlice.reducer; 