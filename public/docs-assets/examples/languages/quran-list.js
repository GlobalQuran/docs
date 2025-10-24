// JavaScript Example: Quran List
// This example shows how to fetch the list of available Quran resources

// API Endpoint
const endpoint = 'https://api.globalquran.com/v1/quran?key=REPLACE_WITH_YOUR_KEY';

// Function to fetch Quran list
async function fetchQuranList() {
    try {
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Quran list:', error);
        throw error;
    }
}

// Function to display Quran list
function displayQuranList(data) {
    if (!data.quranList) {
        console.log('No Quran list found');
        return;
    }
    
    console.log('Available Quran Resources:');
    console.log('========================');
    
    Object.entries(data.quranList).forEach(([quranId, quranData]) => {
        if (quranData.format === 'text' && quranData.type === 'quran') {
            console.log(`ID: ${quranId}`);
            console.log(`Name: ${quranData.english_name}`);
            console.log(`Native Name: ${quranData.native_name}`);
            console.log(`Language: ${quranData.language}`);
            console.log('---');
        }
    });
}

// Function to display translations
function displayTranslations(data) {
    if (!data.quranList) {
        console.log('No translations found');
        return;
    }
    
    console.log('Available Translations:');
    console.log('=====================');
    
    Object.entries(data.quranList).forEach(([quranId, quranData]) => {
        if (quranData.format === 'text' && quranData.type === 'translation') {
            console.log(`ID: ${quranId}`);
            console.log(`Name: ${quranData.english_name}`);
            console.log(`Native Name: ${quranData.native_name}`);
            console.log(`Language: ${quranData.language}`);
            console.log('---');
        }
    });
}

// Function to display recitors
function displayRecitors(data) {
    if (!data.quranList) {
        console.log('No recitors found');
        return;
    }
    
    console.log('Available Recitors:');
    console.log('==================');
    
    Object.entries(data.quranList).forEach(([quranId, quranData]) => {
        if (quranData.format === 'audio') {
            console.log(`ID: ${quranId}`);
            console.log(`Name: ${quranData.english_name}`);
            console.log(`Native Name: ${quranData.native_name}`);
            console.log(`Language: ${quranData.language}`);
            console.log('---');
        }
    });
}

// Usage example
async function main() {
    try {
        const quranListData = await fetchQuranList();
        
        displayQuranList(quranListData);
        console.log('\n');
        displayTranslations(quranListData);
        console.log('\n');
        displayRecitors(quranListData);
    } catch (error) {
        console.error('Failed to load Quran list:', error);
    }
}

// Run the example
main();

// Expected Response Structure:
// {
//   "quranList": {
//     "quran-simple": {
//       "name": "Quran Simple",
//       "english_name": "Quran Simple",
//       "native_name": "القرآن الكريم",
//       "language": "ar",
//       "format": "text",
//       "type": "quran"
//     },
//     "en.sahih": {
//       "name": "Sahih International",
//       "english_name": "Sahih International",
//       "native_name": "Sahih International",
//       "language": "en",
//       "format": "text",
//       "type": "translation"
//     },
//     "abdul_basit_murattal": {
//       "name": "Abdul Basit Murattal",
//       "english_name": "Abdul Basit Murattal",
//       "native_name": "عبد الباسط مرتل",
//       "language": "ar",
//       "format": "audio",
//       "type": "recitor"
//     }
//   }
// }
