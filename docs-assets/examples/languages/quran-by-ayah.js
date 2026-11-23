// JavaScript Example: Quran by Ayah
// This example shows how to fetch a specific Ayah using the GlobalQuran API

// API Endpoint
const endpoint = 'https://api.globalquran.com/v1/ayah/2:255/quran-simple?key=REPLACE_WITH_YOUR_KEY';

// Function to fetch specific Ayah
async function fetchAyah(ayahNumber, quranId = 'quran-simple') {
    try {
        const url = `https://api.globalquran.com/v1/ayah/${ayahNumber}/${quranId}?key=REPLACE_WITH_YOUR_KEY`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Ayah:', error);
        return null;
    }
}

// Function to display Ayah data
function displayAyah(ayahData) {
    if (!ayahData || !ayahData.quran) {
        console.log('No Ayah data available');
        return;
    }
    
    const quran = ayahData.quran;
    console.log('Ayah Data:');
    console.log('==========');
    
    Object.keys(quran).forEach(surahNumber => {
        const surah = quran[surahNumber];
        Object.keys(surah).forEach(ayahNumber => {
            const ayah = surah[ayahNumber];
            console.log(`Surah ${ayah.surah}, Ayah ${ayah.ayah}:`);
            console.log(`Verse: ${ayah.verse}`);
            console.log('---');
        });
    });
}

// Function to get Ayah text only
function getAyahText(ayahData) {
    if (!ayahData || !ayahData.quran) {
        return null;
    }
    
    const quran = ayahData.quran;
    const firstSurah = Object.keys(quran)[0];
    const firstAyah = Object.keys(quran[firstSurah])[0];
    
    return quran[firstSurah][firstAyah].verse;
}

// Main execution
async function main() {
    console.log('Fetching Ayah 2:255 (Ayat al-Kursi)...');
    const ayahData = await fetchAyah('2:255', 'quran-simple');
    
    if (ayahData) {
        displayAyah(ayahData);
        
        const ayahText = getAyahText(ayahData);
        if (ayahText) {
            console.log('\nAyah Text Only:');
            console.log(ayahText);
        }
        
        console.log('\nExample usage:');
        console.log('const ayah = await fetchAyah("2:255", "quran-simple");');
        console.log('const text = getAyahText(ayah);');
    } else {
        console.log('Failed to fetch Ayah data');
    }
}

// Run the example
main();

// Expected Response Structure:
// {
//   "quran": {
//     "2": {
//       "255": { 
//         "surah": 2, 
//         "ayah": 255, 
//         "verse": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ" 
//       }
//     }
//   }
// }