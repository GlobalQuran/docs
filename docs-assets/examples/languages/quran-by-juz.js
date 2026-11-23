// JavaScript Example: Quran by Juz
// This example shows how to fetch Quran content by Juz using the GlobalQuran API

// API Endpoint
const endpoint = 'https://api.globalquran.com/v1/juz/1/quran-simple?key=REPLACE_WITH_YOUR_KEY';

// Function to fetch Quran by Juz
async function fetchQuranByJuz(juzNumber, quranId = 'quran-simple') {
    try {
        const url = `https://api.globalquran.com/v1/juz/${juzNumber}/${quranId}?key=REPLACE_WITH_YOUR_KEY`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Quran by Juz:', error);
        return null;
    }
}

// Function to display Juz data
function displayJuz(juzData) {
    if (!juzData || !juzData.quran) {
        console.log('No Juz data available');
        return;
    }
    
    const quran = juzData.quran;
    console.log('Quran Juz Data:');
    console.log('===============');
    
    Object.keys(quran).forEach(surahNumber => {
        const surah = quran[surahNumber];
        const ayahCount = Object.keys(surah).length;
        console.log(`Surah ${surahNumber}: ${ayahCount} ayahs`);
        
        // Show first few ayahs
        Object.keys(surah).slice(0, 3).forEach(ayahNumber => {
            const ayah = surah[ayahNumber];
            console.log(`  Ayah ${ayah.ayah}: ${ayah.verse.substring(0, 50)}...`);
        });
        
        if (ayahCount > 3) {
            console.log(`  ... and ${ayahCount - 3} more ayahs`);
        }
        console.log('---');
    });
}

// Function to get all ayahs from Juz
function getAllAyahsFromJuz(juzData) {
    if (!juzData || !juzData.quran) {
        return [];
    }
    
    const allAyahs = [];
    const quran = juzData.quran;
    
    Object.keys(quran).forEach(surahNumber => {
        const surah = quran[surahNumber];
        Object.keys(surah).forEach(ayahNumber => {
            allAyahs.push(surah[ayahNumber]);
        });
    });
    
    return allAyahs;
}

// Function to count total ayahs in Juz
function countAyahsInJuz(juzData) {
    const ayahs = getAllAyahsFromJuz(juzData);
    return ayahs.length;
}

// Function to get Surah range in Juz
function getSurahRange(juzData) {
    if (!juzData || !juzData.quran) {
        return { first: null, last: null };
    }
    
    const surahNumbers = Object.keys(juzData.quran).map(Number).sort((a, b) => a - b);
    return {
        first: surahNumbers[0],
        last: surahNumbers[surahNumbers.length - 1]
    };
}

// Main execution
async function main() {
    console.log('Fetching Quran Juz 1...');
    const juzData = await fetchQuranByJuz(1, 'quran-simple');
    
    if (juzData) {
        displayJuz(juzData);
        
        const totalAyahs = countAyahsInJuz(juzData);
        const surahRange = getSurahRange(juzData);
        
        console.log(`\nTotal ayahs in this Juz: ${totalAyahs}`);
        console.log(`Surah range: ${surahRange.first} to ${surahRange.last}`);
        
        const allAyahs = getAllAyahsFromJuz(juzData);
        if (allAyahs.length > 0) {
            console.log('\nFirst ayah in Juz:');
            console.log(`Surah ${allAyahs[0].surah}, Ayah ${allAyahs[0].ayah}: ${allAyahs[0].verse}`);
        }
        
        console.log('\nExample usage:');
        console.log('const juz = await fetchQuranByJuz(1, "quran-simple");');
        console.log('const ayahs = getAllAyahsFromJuz(juz);');
        console.log('const count = countAyahsInJuz(juz);');
        console.log('const range = getSurahRange(juz);');
    } else {
        console.log('Failed to fetch Juz data');
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