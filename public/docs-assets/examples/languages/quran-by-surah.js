// JavaScript Example: Quran by Surah
// This example shows how to fetch a specific Surah using the GlobalQuran API

// API Endpoint
const endpoint = 'https://api.globalquran.com/v1/surah/1/quran-simple?key=REPLACE_WITH_YOUR_KEY';

// Function to fetch Surah data
async function fetchSurah(surahNumber = 1, quranId = 'quran-simple') {
    try {
        const url = `https://api.globalquran.com/v1/surah/${surahNumber}/${quranId}?key=REPLACE_WITH_YOUR_KEY`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Surah:', error);
        throw error;
    }
}

// Function to display Surah verses
function displaySurah(data) {
    if (!data.quran) {
        console.log('No Quran data found');
        return;
    }
    
    // Process the response data
    Object.values(data.quran).forEach(surah => {
        Object.values(surah).forEach(verse => {
            console.log(`${verse.surah}:${verse.ayah} ${verse.verse}`);
        });
    });
}

// Usage example
async function main() {
    try {
        const surahData = await fetchSurah(1); // Al-Fatiha
        displaySurah(surahData);
    } catch (error) {
        console.error('Failed to load Surah:', error);
    }
}

// Run the example
main();

// Expected Response Structure:
// {
//   "quran": {
//     "1": {
//       "1": { "surah": 1, "ayah": 1, "verse": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
//       "2": { "surah": 1, "ayah": 2, "verse": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
//       "3": { "surah": 1, "ayah": 3, "verse": "الرَّحْمَٰنِ الرَّحِيمِ" },
//       "4": { "surah": 1, "ayah": 4, "verse": "مَالِكِ يَوْمِ الدِّينِ" },
//       "5": { "surah": 1, "ayah": 5, "verse": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
//       "6": { "surah": 1, "ayah": 6, "verse": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" },
//       "7": { "surah": 1, "ayah": 7, "verse": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ" }
//     }
//   }
// }
