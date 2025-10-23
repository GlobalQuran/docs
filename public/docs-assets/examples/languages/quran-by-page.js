// JavaScript Example: Quran by Page
// This example shows how to fetch Quran content by page using the GlobalQuran API

// API Endpoint
const endpoint = 'https://api.globalquran.com/v1/page/1/quran-simple?key=YOUR_API_KEY';

// Function to fetch Quran by page
async function fetchQuranByPage(pageNumber, quranId = 'quran-simple') {
    try {
        const url = `https://api.globalquran.com/v1/page/${pageNumber}/${quranId}?key=YOUR_API_KEY`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Quran by page:', error);
        return null;
    }
}

// Function to display page data
function displayPage(pageData) {
    if (!pageData || !pageData.quran) {
        console.log('No page data available');
        return;
    }
    
    const quran = pageData.quran;
    console.log('Quran Page Data:');
    console.log('================');
    
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

// Function to get all ayahs from page
function getAllAyahs(pageData) {
    if (!pageData || !pageData.quran) {
        return [];
    }
    
    const allAyahs = [];
    const quran = pageData.quran;
    
    Object.keys(quran).forEach(surahNumber => {
        const surah = quran[surahNumber];
        Object.keys(surah).forEach(ayahNumber => {
            allAyahs.push(surah[ayahNumber]);
        });
    });
    
    return allAyahs;
}

// Function to count total ayahs on page
function countAyahsOnPage(pageData) {
    const ayahs = getAllAyahs(pageData);
    return ayahs.length;
}

// Main execution
async function main() {
    console.log('Fetching Quran Page 1...');
    const pageData = await fetchQuranByPage(1, 'quran-simple');
    
    if (pageData) {
        displayPage(pageData);
        
        const totalAyahs = countAyahsOnPage(pageData);
        console.log(`\nTotal ayahs on this page: ${totalAyahs}`);
        
        const allAyahs = getAllAyahs(pageData);
        if (allAyahs.length > 0) {
            console.log('\nFirst ayah on page:');
            console.log(`Surah ${allAyahs[0].surah}, Ayah ${allAyahs[0].ayah}: ${allAyahs[0].verse}`);
        }
        
        console.log('\nExample usage:');
        console.log('const page = await fetchQuranByPage(1, "quran-simple");');
        console.log('const ayahs = getAllAyahs(page);');
        console.log('const count = countAyahsOnPage(page);');
    } else {
        console.log('Failed to fetch page data');
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