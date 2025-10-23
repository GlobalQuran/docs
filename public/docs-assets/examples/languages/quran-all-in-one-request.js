// JavaScript Example: All-in-One Request
// This example shows how to fetch multiple data types in a single request using the GlobalQuran API

// API Endpoint
const endpoint = 'https://api.globalquran.com/v1/all/surah/1/quran-simple/en?key=YOUR_API_KEY';

// Function to fetch all-in-one data
async function fetchAllInOneData(dataIn = 'surah', dataInNo = 1, quranId = 'quran-simple', langCode = 'en') {
    try {
        const url = `https://api.globalquran.com/v1/all/${dataIn}/${dataInNo}/${quranId}/${langCode}?key=YOUR_API_KEY`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching all-in-one data:', error);
        return null;
    }
}

// Function to display all data
function displayAllData(data) {
    if (!data) {
        console.log('No data available');
        return;
    }
    
    console.log('All-in-One API Response:');
    console.log('========================');
    
    // Display Quran data
    if (data.quran) {
        console.log('Quran Data:');
        Object.keys(data.quran).forEach(surahKey => {
            const surah = data.quran[surahKey];
            const ayahCount = Object.keys(surah).length;
            console.log(`  Surah ${surahKey}: ${ayahCount} ayahs`);
            
            // Show first few ayahs
            Object.keys(surah).slice(0, 3).forEach(ayahKey => {
                const ayah = surah[ayahKey];
                console.log(`    Ayah ${ayahKey}: ${ayah.verse.substring(0, 50)}...`);
            });
        });
        console.log();
    }
    
    // Display translation data
    if (data.translation) {
        console.log('Translation Data:');
        Object.keys(data.translation).forEach(surahKey => {
            const surah = data.translation[surahKey];
            const ayahCount = Object.keys(surah).length;
            console.log(`  Surah ${surahKey}: ${ayahCount} translations`);
            
            // Show first few translations
            Object.keys(surah).slice(0, 3).forEach(ayahKey => {
                const ayah = surah[ayahKey];
                console.log(`    Ayah ${ayahKey}: ${ayah.text.substring(0, 50)}...`);
            });
        });
        console.log();
    }
    
    // Display recitor data
    if (data.recitor) {
        console.log('Recitor Data:');
        Object.keys(data.recitor).forEach(surahKey => {
            const surah = data.recitor[surahKey];
            const ayahCount = Object.keys(surah).length;
            console.log(`  Surah ${surahKey}: ${ayahCount} recitations`);
        });
        console.log();
    }
}

// Function to get specific ayah from all data
function getAyahFromAllData(data, surahNumber, ayahNumber) {
    if (!data) return null;
    
    const result = {};
    
    if (data.quran && data.quran[surahNumber] && data.quran[surahNumber][ayahNumber]) {
        result.quran = data.quran[surahNumber][ayahNumber];
    }
    
    if (data.translation && data.translation[surahNumber] && data.translation[surahNumber][ayahNumber]) {
        result.translation = data.translation[surahNumber][ayahNumber];
    }
    
    if (data.recitor && data.recitor[surahNumber] && data.recitor[surahNumber][ayahNumber]) {
        result.recitor = data.recitor[surahNumber][ayahNumber];
    }
    
    return Object.keys(result).length > 0 ? result : null;
}

// Function to count total ayahs
function countTotalAyahs(data) {
    if (!data || !data.quran) return 0;
    
    let total = 0;
    Object.keys(data.quran).forEach(surahKey => {
        total += Object.keys(data.quran[surahKey]).length;
    });
    
    return total;
}

// Main execution
async function main() {
    console.log('Fetching all-in-one data for Surah 1...');
    const data = await fetchAllInOneData('surah', 1, 'quran-simple', 'en');
    
    if (data) {
        displayAllData(data);
        
        const totalAyahs = countTotalAyahs(data);
        console.log(`Total ayahs in response: ${totalAyahs}`);
        
        // Example: Get specific ayah
        const ayah = getAyahFromAllData(data, 1, 1);
        if (ayah) {
            console.log('\nSpecific Ayah (1:1):');
            if (ayah.quran) {
                console.log(`Quran: ${ayah.quran.verse}`);
            }
            if (ayah.translation) {
                console.log(`Translation: ${ayah.translation.text}`);
            }
        }
        
        console.log('\nExample usage:');
        console.log('const data = await fetchAllInOneData("surah", 1, "quran-simple", "en");');
        console.log('const ayah = getAyahFromAllData(data, 1, 1);');
        console.log('const count = countTotalAyahs(data);');
    } else {
        console.log('Failed to fetch all-in-one data');
    }
}

// Run the example
main();

// Expected Response Structure:
// {
//   "quran": {
//     "1": {
//       "1": { "surah": 1, "ayah": 1, "verse": "..." },
//       "2": { "surah": 1, "ayah": 2, "verse": "..." }
//     }
//   },
//   "translation": {
//     "1": {
//       "1": { "surah": 1, "ayah": 1, "text": "..." },
//       "2": { "surah": 1, "ayah": 2, "text": "..." }
//     }
//   },
//   "recitor": {
//     "1": {
//       "1": { "surah": 1, "ayah": 1, "audio": "..." },
//       "2": { "surah": 1, "ayah": 2, "audio": "..." }
//     }
//   }
// }
