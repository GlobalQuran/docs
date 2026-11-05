import React, { useState, useEffect, useMemo } from 'react';
import Footer from '../components/Footer';

const AIInstructionsPage = () => {
  const [copiedSection, setCopiedSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const copyToClipboard = async (text, sectionId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const copyAllSections = async () => {
    try {
      const allContent = sections.map(section => 
        `# ${section.title}\n\n${section.content}`
      ).join('\n\n---\n\n');
      
      await navigator.clipboard.writeText(allContent);
      setCopiedSection('all');
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy all sections: ', err);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const instructions = {
    overview: `# Build Quran Application with AI using GlobalQuran API Endpoints

## Universal Compatibility
These instructions can be used to build Quran applications for any platform, device, or programming language. Whether you're developing for:
- **Web Applications** (React, Vue, Angular, vanilla JavaScript)
- **Mobile Apps** (React Native, Flutter, Swift, Kotlin)
- **Desktop Applications** (Electron, .NET, Java)
- **Backend Services** (Node.js, Python, PHP, Java, C#)

The GlobalQuran API provides consistent, RESTful endpoints that work seamlessly across all platforms and programming languages.

## Core Architecture Overview
The application follows a modular architecture where each component handles specific data types:
1. **Lists Management** - Fetch available Quran formats, translations, and recitors
2. **Surah Navigation** - Display surah list and handle surah selection
3. **Content Display** - Show Quran text with optional translations
4. **Audio Integration** - Play recitations with proper format handling
5. **User Preferences** - Manage default selections and user choices`,

    apiEndpoints: `# API Endpoints Reference

## V2 List Endpoints (Recommended)
Use these modern v2 endpoints for better data structure and performance:

### 1. Quran Formats List
\`\`\`
GET https://api.globalquran.com/v2/list/quran?key=YOUR_API_KEY
\`\`\`
**Purpose**: Get all available Quran text formats (Arabic text, transliteration, etc.)
**Response**: Object with Quran format IDs as keys
**Usage**: Populate Quran format selector, set default format

### 2. Translations List  
\`\`\`
GET https://api.globalquran.com/v2/list/translation?key=YOUR_API_KEY
\`\`\`
**Purpose**: Get all available translations in different languages
**Response**: Object with translation IDs as keys
**Usage**: Populate language selector, set default translation

### 3. Recitors List
\`\`\`
GET https://api.globalquran.com/v2/list/recitor?key=YOUR_API_KEY
\`\`\`
**Purpose**: Get all available audio recitors with format details
**Response**: Object with recitor IDs as keys, includes media format info
**Usage**: Populate recitor selector, determine audio formats

## Content Endpoints

### 4. Surah List
\`\`\`
GET https://api.globalquran.com/v1/surah?key=YOUR_API_KEY
\`\`\`
**Purpose**: Get list of all 114 surahs with metadata
**Usage**: Build surah navigation menu

### 5. Individual Surah Content
\`\`\`
GET https://api.globalquran.com/v1/surah/{surahNumber}/{quranFormatId}?key=YOUR_API_KEY
GET https://api.globalquran.com/v1/surah/{surahNumber}/{quranFormatId}|{translationId}?key=YOUR_API_KEY
GET https://api.globalquran.com/v1/surah/{surahNumber}/{quranFormatId}|{translationId1}|{translationId2}?key=YOUR_API_KEY
\`\`\`
**Purpose**: Get complete surah content with optional translations
**Parameters**: 
- surahNumber: 1-114
- quranFormatId: From Quran formats list (required)
- translationId: From translations list (optional, can be multiple separated by |)
**Examples**:
- Single format: \`/v1/surah/1/quran-simple\`
- Format + Translation: \`/v1/surah/1/quran-simple|en.sahih\`
- Multiple translations: \`/v1/surah/1/quran-simple|en.sahih|ar.jalalayn\`

## Pipe-Separated Format Rules
- **Single Format**: \`{quranFormatId}\`
- **Format + Translation**: \`{quranFormatId}|{translationId}\`
- **Multiple Translations**: \`{quranFormatId}|{translationId1}|{translationId2}\`
- **Multiple Formats**: \`{format1}|{format2}|{translationId}\`
- **Complex Combinations**: \`{format1}|{format2}|{translation1}|{translation2}\`

**Important**: The pipe (|) character separates different IDs. You can combine:
- Multiple Quran formats
- Multiple translations  
- Any combination of formats and translations`,

    dataFlow: `# Data Flow Architecture

## 1. Application Initialization
\`\`\`javascript
// Step 1: Load all lists simultaneously
async function initializeApp() {
  const [quranFormats, translations, recitors, surahs] = await Promise.all([
    fetch('https://api.globalquran.com/v2/list/quran?key=YOUR_API_KEY'),
    fetch('https://api.globalquran.com/v2/list/translation?key=YOUR_API_KEY'),
    fetch('https://api.globalquran.com/v2/list/recitor?key=YOUR_API_KEY'),
    fetch('https://api.globalquran.com/v1/surah?key=YOUR_API_KEY')
  ]);
  
  // Process responses and set defaults
  const quranData = await quranFormats.json();
  const translationData = await translations.json();
  const recitorData = await recitors.json();
  const surahData = await surahs.json();
  
  // Set default selections
  const defaultQuran = Object.keys(quranData.list)[0]; // First available format
  const defaultTranslation = Object.keys(translationData.list).find(id => 
    translationData.list[id].default === true
  );
  const defaultRecitor = Object.keys(recitorData.list)[0]; // First available recitor
  
  return {
    quranFormats: quranData.list,
    translations: translationData.list,
    recitors: recitorData.list,
    // /v1/surah returns { surahList: { "1": {...}, "2": {...} } }; turn it into an array the rest of the code can search
    surahs: Object.values(surahData.surahList).map(s => ({
      number: s.surah_number,
      name: s.name_english,
      numberOfAyahs: s.ayahs,
      startAyah: s.start_ayah,          // global number of the surah's first ayah (1 to 6236): needed to find audio files
      skipBismillah: s.skip_bismillah   // true only for At-Tawbah (surah 9)
    })),
    defaults: {
      quran: defaultQuran,
      translation: defaultTranslation,
      recitor: defaultRecitor
    }
  };
}
\`\`\`

## 2. Surah Selection Flow
\`\`\`javascript
// Step 2: Handle surah selection
async function loadSurah(surahNumber, quranFormat, translationIds = []) {
  // Build URL with pipe-separated format and translations
  let urlPath = \`\${surahNumber}/\${quranFormat}\`;
  
  // Add translations if provided
  if (translationIds.length > 0) {
    urlPath += \`|\${translationIds.join('|')}\`;
  }
  
  const url = \`https://api.globalquran.com/v1/surah/\${urlPath}?key=YOUR_API_KEY\`;
  const response = await fetch(url);
  const surahData = await response.json();
  
  // Process surah data
  const verses = surahData.data.verses;
  
  return {
    surahNumber,
    verses: verses.map((verse, index) => ({
      verseNumber: index + 1,
      arabic: verse.text,
      translations: verse.translations || {} // Multiple translations if requested
    })),
    metadata: surahData.data
  };
}
\`\`\``,

    audioIntegration: `# Audio Integration Architecture

## 1. Audio URL Construction
Audio is one file per ayah. **Files are named by the global ayah number (1 to 6236, counted through the whole Quran), not by the surah number**: \`114.mp3\` is the 114th ayah of the Quran (inside Al-Baqarah), not Surah An-Nas. Surah 114 starts at global ayah 6231.

\`\`\`
https://audio.globalquran.com/{recitorId}/{mp3|ogg}/{kbs}kbs/{globalAyah}.{mp3|ogg}
https://audio.globalquran.com/ar.alafasy/mp3/128kbs/262.mp3      (Ayat al-Kursi, 2:255)
\`\`\`

Global ayah number = \`start_ayah\` of the surah (from \`/v1/surah\`) + ayah number - 1.

\`\`\`javascript
// Step 3: Build audio URLs
function globalAyah(surah, ayahNumber) {
  return surah.startAyah + ayahNumber - 1;   // startAyah comes from /v1/surah (start_ayah)
}

// A recitor's "media" (from /v2/list/recitor) is an object like { "mp3-128": {kbs, type, status, auz}, "ogg-64": {...} }.
// Return the usable variants, best first. Try the next one if a file fails to load: a listed variant is not
// guaranteed to exist for every ayah.
function audioVariants(media) {
  const probe = document.createElement('audio');
  const canOgg = probe.canPlayType('audio/ogg; codecs="vorbis"') !== '';
  return Object.values(media)
    .filter(m => m.status === 'active' && (m.type === 'mp3' || (m.type === 'ogg' && canOgg)))
    .sort((a, b) => (a.type === 'mp3' ? 0 : 1) - (b.type === 'mp3' ? 0 : 1) || Number(b.kbs) - Number(a.kbs)); // mp3 first (plays everywhere), highest bitrate first
}

function buildAudioUrl(recitorId, globalAyahNumber, variant) {
  return \`https://audio.globalquran.com/\${recitorId}/\${variant.type}/\${variant.kbs}kbs/\${globalAyahNumber}.\${variant.type}\`;
}

// Optional: the "A'udhu billah" (seeking refuge) recording. Only recitors whose media entries have an "auz" field have it:
//   https://audio.globalquran.com/{recitorId}/{type}/{kbs}kbs/0.{type}
\`\`\`

## 3. Bismillah Logic Explanation
The Bismillah is not a separate recording: it is the audio of the very first ayah of the Quran (Al-Fatiha 1:1), global ayah number 1, so its file is always named \`1\`.

### Bismillah Rules:
- **Al-Fatiha (Surah 1)**: the Bismillah IS its first ayah (1:1). Play the surah normally and do not add another Bismillah in front of it.
- **At-Tawbah (Surah 9)**: has no Bismillah (the API marks it with \`skip_bismillah: true\`).
- **All other surahs**: the Bismillah is recited before the first ayah, so play file \`1\` first, then the surah's real first ayah.
- If a listener chooses to start from a specific ayah ("play from here"), do not add the Bismillah.

### Playback Flow:
1. **Check if the surah needs a Bismillah**: \`surahNumber !== 1 && !surah.skipBismillah\`
2. **If yes and starting from the top**: play global ayah 1 first
3. **After the Bismillah**: play the actual first ayah of the surah
4. **Continue**: normal ayah-by-ayah progression
5. **Next surah**: work out again whether it needs a Bismillah and repeat

### Audio URL Construction:
- **Bismillah**: \`https://audio.globalquran.com/{recitorId}/{type}/{kbs}kbs/1.{type}\`
- **Actual Ayah**: \`https://audio.globalquran.com/{recitorId}/{type}/{kbs}kbs/{globalAyah}.{type}\` where \`globalAyah = start_ayah + ayah - 1\`

## 2. Advanced Audio Player Implementation
\`\`\`javascript
// Step 4: Implement advanced audio player with ayah/surah progression
class QuranAudioPlayer {
  constructor() {
    this.currentAudio = null;
    this.currentSurah = null;
    this.currentAyah = null;
    this.currentRecitor = null;
    this.variants = [];        // usable audio variants of the current recitor, best first
    this.variantIndex = 0;
    this.surahs = [];          // normalised surah list (see initializeApp)
    this.surahData = null;
    this.isPlaying = false;
    this.shouldPlayBismillah = false;
    this.bismillahPlayed = false;
    
  }

  setSurahs(surahs) {
    this.surahs = surahs;
  }

  // The Bismillah goes in front of every surah except Al-Fatiha (its ayah 1 IS the Bismillah) and At-Tawbah (none)
  needsBismillah(surah) {
    return surah.number !== 1 && !surah.skipBismillah;
  }

  async playSurah(recitorId, surahNumber, media, surahData) {
    // Stop current audio if playing
    this.stop();
    
    this.currentRecitor = recitorId;
    this.currentSurah = surahNumber;
    this.currentAyah = 1;
    this.variants = audioVariants(media);
    this.variantIndex = 0;
    this.surahData = surahData;
    this.bismillahPlayed = false;
    
    // Determine if we should play Bismillah
    this.shouldPlayBismillah = this.needsBismillah(surahData);
    
    // Start playing
    await this.playCurrentAyah();
  }
  
  async playCurrentAyah() {
    if (!this.currentRecitor || !this.currentSurah || !this.currentAyah) {
      return;
    }
    
    // Stop current audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    let globalNumber;

    // Check if we need to play Bismillah first
    if (this.shouldPlayBismillah && !this.bismillahPlayed && this.currentAyah === 1) {
      // The Bismillah is the audio of global ayah 1 (Al-Fatiha 1:1)
      globalNumber = 1;
      this.bismillahPlayed = true;
    } else {
      // Play the actual ayah: files are numbered through the whole Quran
      globalNumber = globalAyah(this.surahData, this.currentAyah);
    }

    await this.playFile(globalNumber);
  }

  async playFile(globalNumber) {
    const variant = this.variants[this.variantIndex];
    if (!variant) {
      console.error('No playable audio variant for this recitor');
      return;
    }

    // Create and play new audio
    this.currentAudio = new Audio(buildAudioUrl(this.currentRecitor, globalNumber, variant));
    this.currentAudio.crossOrigin = 'anonymous';

    // Set up event listeners
    this.currentAudio.addEventListener('ended', () => {
      this.onAyahEnded();
    });

    this.currentAudio.addEventListener('error', (error) => {
      console.error('Audio playback error:', error);
      // The file may not exist in this variant: try the next one before giving up on the ayah
      if (this.variantIndex + 1 < this.variants.length) {
        this.variantIndex++;
        this.playFile(globalNumber);
      } else {
        this.variantIndex = 0;
        this.onAyahEnded(); // Try to continue to next ayah
      }
    });

    try {
      await this.currentAudio.play();
      this.isPlaying = true;

      // Update UI to show current ayah
      this.updateCurrentAyahDisplay();

    } catch (error) {
      console.error('Audio playback failed:', error);
      this.onAyahEnded(); // Try to continue to next ayah
    }
  }

  onAyahEnded() {
    this.isPlaying = false;
    
    // If we just played Bismillah, now play the actual first ayah
    if (this.shouldPlayBismillah && this.bismillahPlayed && this.currentAyah === 1) {
      // Bismillah finished, now play actual first ayah
      this.playCurrentAyah();
      return;
    }
    
    // Move to next ayah
    this.currentAyah++;
    
    // Check if we've finished all ayahs in current surah
    if (this.currentAyah > this.surahData.numberOfAyahs) {
      // Move to next surah
      this.currentSurah++;
      this.currentAyah = 1;
      this.bismillahPlayed = false;
      
      // Check if we've finished all surahs
      if (this.currentSurah > 114) {
        this.stop();
        this.onPlaybackComplete();
        return;
      }
      
      // Update surah data for the new surah (and whether it needs a Bismillah)
      this.loadSurahData(this.currentSurah);
      this.shouldPlayBismillah = this.needsBismillah(this.surahData);
    }
    
    // Continue playing
    this.playCurrentAyah();
  }
  
  loadSurahData(surahNumber) {
    // The list was loaded once at start-up (see initializeApp): no new request is needed
    this.surahData = this.surahs.find(surah => surah.number === surahNumber);

    // Update UI with new surah info
    this.updateSurahDisplay();
  }

  pause() {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause();
      this.isPlaying = false;
    }
  }
  
  resume() {
    if (this.currentAudio && !this.isPlaying) {
      this.currentAudio.play().then(() => {
        this.isPlaying = true;
      }).catch(error => {
        console.error('Failed to resume audio:', error);
      });
    }
  }
  
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isPlaying = false;
  }
  
  skipToAyah(ayahNumber) {
    if (ayahNumber >= 1 && ayahNumber <= this.surahData.numberOfAyahs) {
      this.currentAyah = ayahNumber;
      this.bismillahPlayed = true; // The listener chose this ayah: no Bismillah in front of it
      this.playCurrentAyah();
    }
  }
  
  skipToSurah(surahNumber) {
    if (surahNumber >= 1 && surahNumber <= 114) {
      this.currentSurah = surahNumber;
      this.currentAyah = 1;
      this.bismillahPlayed = false;
      this.loadSurahData(surahNumber);
      this.playCurrentAyah();
    }
  }
  
  updateCurrentAyahDisplay() {
    // Update UI to highlight current ayah
    const ayahElement = document.querySelector(\`[data-ayah="\${this.currentAyah}"]\`);
    if (ayahElement) {
      // Remove previous highlights
      document.querySelectorAll('.ayah-playing').forEach(el => {
        el.classList.remove('ayah-playing');
      });
      
      // Highlight current ayah
      ayahElement.classList.add('ayah-playing');
      ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  updateSurahDisplay() {
    // Update UI to show current surah
    const surahElement = document.querySelector(\`[data-surah="\${this.currentSurah}"]\`);
    if (surahElement) {
      // Remove previous highlights
      document.querySelectorAll('.surah-playing').forEach(el => {
        el.classList.remove('surah-playing');
      });
      
      // Highlight current surah
      surahElement.classList.add('surah-playing');
    }
  }
  
  onPlaybackComplete() {
    // Called when all surahs are finished
    console.log('Playback completed - all surahs finished');
    
    // Update UI
    document.querySelectorAll('.ayah-playing, .surah-playing').forEach(el => {
      el.classList.remove('ayah-playing', 'surah-playing');
    });
    
    // Show completion message
    this.showCompletionMessage();
  }
  
  showCompletionMessage() {
    // Show completion notification
    const notification = document.createElement('div');
    notification.className = 'playback-complete-notification';
    notification.innerHTML = \`
      <div style="background: #28a745; color: white; padding: 15px; border-radius: 8px; margin: 10px;">
        <i class="fas fa-check-circle"></i> 
        Playback Complete - All 114 Surahs Finished!
      </div>
    \`;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
  
  // Get current playback status
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentSurah: this.currentSurah,
      currentAyah: this.currentAyah,
      currentRecitor: this.currentRecitor,
      shouldPlayBismillah: this.shouldPlayBismillah,
      bismillahPlayed: this.bismillahPlayed
    };
  }
}
\`\`\``,

    userInterface: `# User Interface Components

## 1. Surah Navigation Component
\`\`\`javascript
// Component: Surah List Navigation
function SurahNavigation({ surahs, onSurahSelect, currentSurah }) {
  return (
    <div className="surah-nav">
      <h3>Surahs</h3>
      <div className="surah-list">
        {surahs.map(surah => (
          <div 
            key={surah.number}
            className={\`surah-item \${currentSurah === surah.number ? 'active' : ''}\`}
            onClick={() => onSurahSelect(surah.number)}
          >
            <span className="surah-number">{surah.number}</span>
            <span className="surah-name">{surah.englishName}</span>
            <span className="surah-arabic">{surah.name}</span>
            <span className="verse-count">{surah.numberOfAyahs} verses</span>
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

## 2. Content Display Component
\`\`\`javascript
// Component: Surah Content Display
function SurahContent({ surahData, showTranslations, selectedTranslations = [] }) {
  return (
    <div className="surah-content">
      <div className="surah-header">
        <h2>{surahData.englishName}</h2>
        <p className="surah-arabic">{surahData.name}</p>
        <p className="verse-count">{surahData.numberOfAyahs} verses</p>
      </div>
      
      <div className="verses-container">
        {surahData.verses.map((verse, index) => (
          <div key={index} className="verse">
            <div className="verse-number">{index + 1}</div>
            <div className="verse-content">
              <div className="arabic-text">{verse.arabic}</div>
              {showTranslations && verse.translations && (
                <div className="translations-container">
                  {selectedTranslations.map(translationId => (
                    <div key={translationId} className="translation-text">
                      <strong>{translationId}:</strong> {verse.translations[translationId]}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

## 3. Advanced Audio Controls Component
\`\`\`javascript
// Component: Advanced Audio Player Controls
function AdvancedAudioControls({ 
  audioPlayer, 
  currentSurah, 
  currentAyah, 
  surahData,
  onSurahChange 
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  
  useEffect(() => {
    // Update status every second
    const interval = setInterval(() => {
      if (audioPlayer) {
        const status = audioPlayer.getStatus();
        setPlaybackStatus(status);
        setIsPlaying(status.isPlaying);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [audioPlayer]);
  
  const handlePlayPause = () => {
    if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.resume();
    }
  };
  
  const handleStop = () => {
    audioPlayer.stop();
  };
  
  const handleSkipToAyah = (ayahNumber) => {
    audioPlayer.skipToAyah(ayahNumber);
  };
  
  const handleSkipToSurah = (surahNumber) => {
    audioPlayer.skipToSurah(surahNumber);
    onSurahChange(surahNumber);
  };
  
  return (
    <div className="advanced-audio-controls">
      <div className="playback-info">
        <div className="current-position">
          <strong>Surah {playbackStatus?.currentSurah || currentSurah}</strong>
          <span className="ayah-info">
            Ayah {playbackStatus?.currentAyah || currentAyah} of {surahData?.numberOfAyahs || '?'}
          </span>
        </div>
        
        <div className="bismillah-status">
          {playbackStatus?.shouldPlayBismillah && !playbackStatus?.bismillahPlayed && (
            <span className="badge badge-info">Bismillah will play first</span>
          )}
          {playbackStatus?.shouldPlayBismillah && playbackStatus?.bismillahPlayed && (
            <span className="badge badge-success">Bismillah played</span>
          )}
        </div>
      </div>
      
      <div className="control-buttons">
        <button 
          onClick={handlePlayPause}
          className={\`btn \${isPlaying ? 'btn-warning' : 'btn-success'}\`}
        >
          {isPlaying ? (
            <>
              <i className="fas fa-pause"></i> Pause
            </>
          ) : (
            <>
              <i className="fas fa-play"></i> Play
            </>
          )}
        </button>
        
        <button 
          onClick={handleStop}
          className="btn btn-danger"
        >
          <i className="fas fa-stop"></i> Stop
        </button>
        
        <button 
          onClick={() => handleSkipToSurah(Math.max(1, (playbackStatus?.currentSurah || 1) - 1))}
          className="btn btn-outline-primary"
          disabled={!playbackStatus?.currentSurah || playbackStatus.currentSurah <= 1}
        >
          <i className="fas fa-step-backward"></i> Previous Surah
        </button>
        
        <button 
          onClick={() => handleSkipToSurah(Math.min(114, (playbackStatus?.currentSurah || 1) + 1))}
          className="btn btn-outline-primary"
          disabled={!playbackStatus?.currentSurah || playbackStatus.currentSurah >= 114}
        >
          <i className="fas fa-step-forward"></i> Next Surah
        </button>
      </div>
      
      <div className="progress-info">
        <div className="surah-progress">
          <span>Surah Progress: {playbackStatus?.currentSurah || 1} / 114</span>
          <div className="progress">
            <div 
              className="progress-bar" 
              style={{ 
                width: \`\${((playbackStatus?.currentSurah || 1) / 114) * 100}%\` 
              }}
            ></div>
          </div>
        </div>
        
        <div className="ayah-progress">
          <span>Ayah Progress: {playbackStatus?.currentAyah || 1} / {surahData?.numberOfAyahs || '?'}</span>
          <div className="progress">
            <div 
              className="progress-bar" 
              style={{ 
                width: \`\${((playbackStatus?.currentAyah || 1) / (surahData?.numberOfAyahs || 1)) * 100}%\` 
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="quick-navigation">
        <h6>Quick Navigation:</h6>
        <div className="ayah-buttons">
          {Array.from({ length: Math.min(10, surahData?.numberOfAyahs || 10) }, (_, i) => i + 1).map(ayahNum => (
            <button
              key={ayahNum}
              onClick={() => handleSkipToAyah(ayahNum)}
              className={\`btn btn-sm \${playbackStatus?.currentAyah === ayahNum ? 'btn-primary' : 'btn-outline-secondary'}\`}
            >
              {ayahNum}
            </button>
          ))}
          {surahData?.numberOfAyahs > 10 && (
            <span className="text-muted">... and {surahData.numberOfAyahs - 10} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
\`\`\``,

    settingsManagement: `# Settings and Preferences Management

## 1. User Preferences Storage
\`\`\`javascript
// User preferences management
class UserPreferences {
  constructor() {
    this.storageKey = 'quran_app_preferences';
    this.defaults = {
      quranFormat: 'quran-simple',
      translation: 'en.sahih',
      recitor: 'ar.abdulbasitmurattal',
      showTranslation: true,
      audioEnabled: true,
      theme: 'light'
    };
  }
  
  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? { ...this.defaults, ...JSON.parse(stored) } : this.defaults;
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return this.defaults;
    }
  }
  
  save(preferences) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }
  
  update(key, value) {
    const current = this.load();
    current[key] = value;
    this.save(current);
    return current;
  }
}
\`\`\`

## 2. Settings Panel Component
\`\`\`javascript
// Component: Settings Panel
function SettingsPanel({ preferences, onPreferenceChange, availableOptions }) {
  return (
    <div className="settings-panel">
      <h3>Settings</h3>
      
      <div className="setting-group">
        <label>Quran Format:</label>
        <select 
          value={preferences.quranFormat}
          onChange={(e) => onPreferenceChange('quranFormat', e.target.value)}
        >
          {Object.entries(availableOptions.quranFormats).map(([id, format]) => (
            <option key={id} value={id}>{format.name}</option>
          ))}
        </select>
      </div>
      
      <div className="setting-group">
        <label>Translation:</label>
        <select 
          value={preferences.translation}
          onChange={(e) => onPreferenceChange('translation', e.target.value)}
        >
          {Object.entries(availableOptions.translations).map(([id, translation]) => (
            <option key={id} value={id}>{translation.name}</option>
          ))}
        </select>
      </div>
      
      <div className="setting-group">
        <label>Recitor:</label>
        <select 
          value={preferences.recitor}
          onChange={(e) => onPreferenceChange('recitor', e.target.value)}
        >
          {Object.entries(availableOptions.recitors).map(([id, recitor]) => (
            <option key={id} value={id}>{recitor.name}</option>
          ))}
        </select>
      </div>
      
      <div className="setting-group">
        <label>
          <input 
            type="checkbox"
            checked={preferences.showTranslation}
            onChange={(e) => onPreferenceChange('showTranslation', e.target.checked)}
          />
          Show Translation
        </label>
      </div>
    </div>
  );
}
\`\`\``,

    implementation: `# Complete Implementation Example

## 1. Main Application Class
\`\`\`javascript
// Main Quran Application Class
class QuranApp {
  constructor() {
    this.preferences = new UserPreferences();
    this.audioPlayer = new QuranAudioPlayer();
    this.currentSurah = 1;
    this.appData = null;
  }
  
  async initialize() {
    try {
      // Load user preferences
      const userPrefs = this.preferences.load();
      
      // Initialize app data
      this.appData = await initializeApp();
      this.audioPlayer.setSurahs(this.appData.surahs);   // the player moves from surah to surah without asking the API again
      
      // Set up UI components
      this.setupUI();
      
      // Load initial surah
      await this.loadSurah(this.currentSurah, userPrefs.quranFormat, userPrefs.translation);
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }
  
  async loadSurah(surahNumber, quranFormat, translationIds = []) {
    try {
      const surahData = await loadSurah(surahNumber, quranFormat, translationIds);
      this.currentSurah = surahNumber;
      
      // Update UI
      this.updateSurahContent(surahData);
      this.updateNavigation(surahNumber);
      
    } catch (error) {
      console.error('Failed to load surah:', error);
    }
  }
  
  async playAudio(recitorId, surahNumber) {
    const recitorData = this.appData.recitors[recitorId];
    const surahData = this.appData.surahs.find(surah => surah.number === surahNumber);
    
    if (recitorData && recitorData.media && surahData) {
      await this.audioPlayer.playSurah(recitorId, surahNumber, recitorData.media, surahData);
    }
  }
  
  async playAudioFromAyah(recitorId, surahNumber, ayahNumber) {
    const recitorData = this.appData.recitors[recitorId];
    const surahData = this.appData.surahs.find(surah => surah.number === surahNumber);
    
    if (recitorData && recitorData.media && surahData) {
      await this.audioPlayer.playSurah(recitorId, surahNumber, recitorData.media, surahData);
      // Skip to specific ayah
      this.audioPlayer.skipToAyah(ayahNumber);
    }
  }
  
  updatePreference(key, value) {
    const newPrefs = this.preferences.update(key, value);
    
    // Reload content if relevant preference changed
    if (['quranFormat', 'translations'].includes(key)) {
      const translationIds = Array.isArray(newPrefs.translations) ? 
        newPrefs.translations : [newPrefs.translations].filter(Boolean);
      this.loadSurah(this.currentSurah, newPrefs.quranFormat, translationIds);
    }
  }
}
\`\`\`

## 2. Application Entry Point
\`\`\`javascript
// Application entry point
document.addEventListener('DOMContentLoaded', async () => {
  const app = new QuranApp();
  await app.initialize();
  
  // Make app globally available for debugging
  window.quranApp = app;
});
\`\`\``,

    bestPractices: `# Best Practices and Optimization

## 1. Performance Optimization
\`\`\`javascript
// Implement caching for better performance
class DataCache {
  constructor() {
    this.cache = new Map();
    this.maxAge = 5 * 60 * 1000; // 5 minutes
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  clear() {
    this.cache.clear();
  }
}
\`\`\`

## 2. Error Handling
\`\`\`javascript
// Robust error handling
async function safeApiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}
\`\`\`

## 3. Responsive Design Considerations
- Use CSS Grid or Flexbox for layout
- Implement mobile-first design approach
- Ensure touch-friendly controls for mobile devices
- Consider offline functionality with service workers
- Implement proper loading states and error boundaries

## 4. Accessibility Features
- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation support
- Provide alternative text for audio controls
- Support screen readers with proper markup`,

    deployment: `# Deployment and Distribution

## 1. Environment Configuration
\`\`\`javascript
// Environment configuration
const config = {
  development: {
    apiBaseUrl: 'https://api.globalquran.com',
    apiKey: 'YOUR_DEVELOPMENT_API_KEY',
    debug: true
  },
  production: {
    apiBaseUrl: 'https://api.globalquran.com',
    apiKey: 'YOUR_PRODUCTION_API_KEY',
    debug: false
  }
};

const currentConfig = config[process.env.NODE_ENV || 'development'];
\`\`\`

## 2. Build Configuration
- Keep the API key in configuration (an environment variable at build time, or on your server) rather than hard-coded in source files
- Implement proper error logging
- Set up monitoring and analytics
- Configure CDN for static assets
- Implement proper caching strategies

## 3. Testing Strategy
- Unit tests for utility functions
- Integration tests for API calls
- End-to-end tests for user workflows
- Performance testing for large datasets
- Cross-browser compatibility testing

## 4. Security Considerations
- Treat an API key as an identifier, not a secret: a key used in browser code (as the \`?key=\` examples in this guide do) is visible to anyone who opens the page, so give it no rights you would not give the public
- If a key must stay private, call the API from your own server and let the browser talk to your server instead
- Implement proper CORS policies
- Use HTTPS for all API communications
- Validate and sanitize user inputs
- Cache list responses (they rarely change), fetch a whole surah at once instead of ayah by ayah, and rate-limit your own calls to the API`
  };

  const sections = useMemo(() => [
    { id: 'overview', title: 'Overview & Architecture', content: instructions.overview },
    { id: 'apiEndpoints', title: 'API Endpoints Reference', content: instructions.apiEndpoints },
    { id: 'dataFlow', title: 'Data Flow Architecture', content: instructions.dataFlow },
    { id: 'audioIntegration', title: 'Audio Integration', content: instructions.audioIntegration },
    { id: 'userInterface', title: 'User Interface Components', content: instructions.userInterface },
    { id: 'settingsManagement', title: 'Settings Management', content: instructions.settingsManagement },
    { id: 'implementation', title: 'Complete Implementation', content: instructions.implementation },
    { id: 'bestPractices', title: 'Best Practices', content: instructions.bestPractices },
    { id: 'deployment', title: 'Deployment Guide', content: instructions.deployment }
  ], [
    instructions.overview,
    instructions.apiEndpoints,
    instructions.dataFlow,
    instructions.audioIntegration,
    instructions.userInterface,
    instructions.settingsManagement,
    instructions.implementation,
    instructions.bestPractices,
    instructions.deployment
  ]);

  // Initialize all sections as expanded by default
  useEffect(() => {
    const initial = {};
    sections.forEach(section => {
      initial[section.id] = true;
    });
    setExpandedSections(initial);
  }, [sections]);

  return (
    <div className="container-fluid ai-instructions-page" style={{ padding: '0', background: 'white', minHeight: '100vh' }}>
      <div className="row" style={{ margin: '0' }}>
        <div className="col-md-12" style={{ padding: '0' }}>
          {/* Hero Section */}
          <div className="jumbotron" style={{ 
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)', 
            color: 'white', 
            marginBottom: '40px',
            padding: '60px 0',
            position: 'relative'
          }}>
            <div className="container">
              <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <i className="fas fa-calendar-alt" style={{ marginRight: '6px' }}></i>
                  Last Updated: {new Date('2025-10-24').toLocaleDateString('en-US', {
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              
              <h1 className="display-4">
                <i className="fas fa-robot"></i> AI Instructions
              </h1>
              <p className="lead">
                Comprehensive guide for building Quran applications using GlobalQuran API endpoints. 
                Perfect for AI assistants, developers, and anyone looking to create Islamic applications.
              </p>
              <div style={{ marginTop: '30px' }}>
                <span className="badge badge-light" style={{ fontSize: '14px', padding: '8px 16px' }}>
                  <i className="fas fa-globe"></i> Universal Compatibility
                </span>
                <span className="badge badge-light" style={{ fontSize: '14px', padding: '8px 16px', marginLeft: '10px' }}>
                  <i className="fas fa-code"></i> Multi-Platform
                </span>
                <span className="badge badge-light" style={{ fontSize: '14px', padding: '8px 16px', marginLeft: '10px' }}>
                  <i className="fas fa-mobile-alt"></i> Cross-Device
                </span>
              </div>
            </div>
          </div>

          {/* Instructions Sections */}
          <div className="container" style={{ maxWidth: '1200px', marginBottom: '50px' }}>
            {/* Copy All Sections Button */}
            <div style={{ 
              textAlign: 'right', 
              marginBottom: '30px'
            }}>
              <button 
                onClick={copyAllSections}
                className="btn btn-outline-primary btn-sm"
                style={{
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {copiedSection === 'all' ? (
                  <>
                    <i className="fas fa-check"></i> All Sections Copied!
                  </>
                ) : (
                  <>
                    <i className="fas fa-copy"></i> Copy All Sections
                  </>
                )}
              </button>
            </div>

            {sections.map((section, index) => (
              <div key={section.id} className="instruction-section" style={{ 
                marginBottom: '40px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                <div 
                  className="section-header" 
                  onClick={() => toggleSection(section.id)}
                  style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    padding: '20px 30px',
                    borderBottom: '1px solid #dee2e6',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    userSelect: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #e9ecef 0%, #f8f9fa 100%)'}
                  onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ 
                      margin: '0', 
                      color: 'var(--primary-color)',
                      fontSize: '24px',
                      fontWeight: '600'
                    }}>
                      <span style={{ 
                        background: 'var(--primary-color)', 
                        color: 'white', 
                        borderRadius: '50%', 
                        width: '35px', 
                        height: '35px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        marginRight: '15px',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </span>
                      {section.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(section.content, section.id);
                      }}
                      className="btn btn-outline-primary btn-sm"
                      style={{
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {copiedSection === section.id ? (
                        <>
                          <i className="fas fa-check"></i> Copied!
                        </>
                      ) : (
                        <>
                          <i className="fas fa-copy"></i> Copy Section
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div 
                  className="section-content" 
                  style={{ 
                    padding: expandedSections[section.id] === false ? '0' : '30px',
                    maxHeight: expandedSections[section.id] === false ? '0' : 'none',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div 
                    style={{
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#333',
                      background: '#f8f9fa',
                      padding: '25px',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                      whiteSpace: 'pre-wrap',
                      overflow: 'auto',
                      maxHeight: '600px',
                      userSelect: 'text'
                    }}
                  >
                    {section.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="alert alert-info" style={{ 
            margin: '50px 30px', 
            textAlign: 'center',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
          }}>
            <h4 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>
              <i className="fas fa-rocket"></i> Ready to Build Your Quran Application?
            </h4>
            <p className="mb-3" style={{ fontSize: '16px', color: '#333' }}>
              Use these instructions with any AI assistant or development framework to create 
              beautiful, functional Quran applications for any platform or device.
            </p>
            <div style={{ marginTop: '25px' }}>
              <a href="https://app.globalquran.com" target="_blank" rel="noopener noreferrer" 
                 className="btn btn-success btn-lg" style={{ marginRight: '15px' }}>
                <i className="fas fa-key"></i> Get API Key
              </a>
              <a href="/examples" className="btn btn-outline-primary btn-lg">
                <i className="fas fa-code"></i> View Examples
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AIInstructionsPage;
