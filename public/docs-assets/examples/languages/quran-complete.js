// JavaScript Example: Complete Quran
// This example shows how to fetch the complete Quran using the GlobalQuran API

// API Endpoint
const endpoint = 'https://api.globalquran.com/v1/quran/quran-simple?key=YOUR_API_KEY';

// Function to fetch complete Quran
async function fetchCompleteQuran(quranId = 'quran-simple') {
    try {
        const url = `https://api.globalquran.com/v1/quran/${quranId}?key=YOUR_API_KEY`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching complete Quran:', error);
        return null;
    }
}

// Function to display Quran data
function displayQuran(quranData) {
    if (!quranData || !quranData.quran) {
        console.log('No Quran data available');
        return;
    }
    
    const quran = quranData.quran;
    console.log('Complete Quran Data:');
    console.log('==================');
    
    // Display summary
    const surahCount = Object.keys(quran).length;
    console.log(`Total Surahs: ${surahCount}`);
    
    // Display first few surahs
    Object.keys(quran).slice(0, 3).forEach(surahNumber => {
        const surah = quran[surahNumber];
        const ayahCount = Object.keys(surah).length;
        console.log(`Surah ${surahNumber}: ${ayahCount} ayahs`);
        
        // Show first ayah
        const firstAyah = surah[Object.keys(surah)[0]];
        console.log(`  Ayah 1: ${firstAyah.verse.substring(0, 50)}...`);
    });
}

// Function to search for specific ayah
function findAyah(quranData, surahNumber, ayahNumber) {
    if (!quranData || !quranData.quran || !quranData.quran[surahNumber]) {
        return null;
    }
    
    const surah = quranData.quran[surahNumber];
    return surah[ayahNumber] || null;
}

// Main execution
async function main() {
    console.log('Fetching complete Quran...');
    const quranData = await fetchCompleteQuran('quran-simple');
    
    if (quranData) {
        displayQuran(quranData);
        
        // Example: Find specific ayah
        const ayah = findAyah(quranData, 1, 1);
        if (ayah) {
            console.log('\nSpecific Ayah (1:1):');
            console.log(`Surah: ${ayah.surah}, Ayah: ${ayah.ayah}`);
            console.log(`Verse: ${ayah.verse}`);
        }
        
        console.log('\nExample usage:');
        console.log('const quran = await fetchCompleteQuran("quran-simple");');
        console.log('const ayah = findAyah(quran, 1, 1);');
    } else {
        console.log('Failed to fetch Quran data');
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
//     },
//     "2": {
//       "1": { "surah": 2, "ayah": 1, "verse": "الم" },
//       "2": { "surah": 2, "ayah": 2, "verse": "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ" }
//     }
//   }
// }