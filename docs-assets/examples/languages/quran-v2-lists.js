// JavaScript Example: v2 API Lists
// This example shows how to use the new v2 API endpoints for fetching lists

// API Endpoints
const translationEndpoint = 'https://api.globalquran.com/v2/list/translation?key=REPLACE_WITH_YOUR_KEY';
const recitorEndpoint = 'https://api.globalquran.com/v2/list/recitor?key=REPLACE_WITH_YOUR_KEY';
const quranEndpoint = 'https://api.globalquran.com/v2/list/quran?key=REPLACE_WITH_YOUR_KEY';

// Function to fetch v2 API lists
async function fetchV2List(listType = 'translation') {
    try {
        const url = `https://api.globalquran.com/v2/list/${listType}?key=REPLACE_WITH_YOUR_KEY`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching ${listType} list:`, error);
        return null;
    }
}

// Function to display v2 API list
function displayV2List(data, listType) {
    if (!data || !data[listType]) {
        console.log(`No ${listType} data available`);
        return;
    }
    
    const items = data[listType];
    console.log(`v2 API - ${listType.charAt(0).toUpperCase() + listType.slice(1)} List:`);
    console.log('='.repeat(50));
    console.log(`Found ${Object.keys(items).length} ${listType}s:`);
    console.log('-'.repeat(30));
    
    Object.keys(items).forEach(itemId => {
        const item = items[itemId];
        console.log(`ID: ${itemId}`);
        console.log(`Name: ${item.name || 'N/A'}`);
        console.log(`Language: ${item.language || 'N/A'}`);
        if (item.author) {
            console.log(`Author: ${item.author}`);
        }
        if (item.style) {
            console.log(`Style: ${item.style}`);
        }
        console.log('-'.repeat(20));
    });
}

// Function to compare v1 vs v2 API responses
function compareV1V2() {
    console.log('Comparing v1 vs v2 API responses:');
    console.log('='.repeat(50));
    console.log('v2 API Response Structure:');
    console.log('- More organized data structure');
    console.log('- Better error handling');
    console.log('- Consistent response format');
    console.log('- Enhanced metadata');
    
    console.log('\nExample v2 usage:');
    console.log('https://api.globalquran.com/v2/list/translation?key=REPLACE_WITH_YOUR_KEY');
    console.log('https://api.globalquran.com/v2/list/recitor?key=REPLACE_WITH_YOUR_KEY');
    console.log('https://api.globalquran.com/v2/list/quran?key=REPLACE_WITH_YOUR_KEY');
}

// Function to get item by ID from v2 list
function getItemById(data, listType, itemId) {
    if (!data || !data[listType] || !data[listType][itemId]) {
        return null;
    }
    
    return data[listType][itemId];
}

// Function to filter items by language
function getItemsByLanguage(data, listType, language) {
    if (!data || !data[listType]) {
        return [];
    }
    
    return Object.entries(data[listType])
        .filter(([id, item]) => item.language === language)
        .map(([id, item]) => ({ id, ...item }));
}

// Main execution
async function main() {
    console.log('Testing v2 API Lists...');
    console.log();
    
    // Test translation list
    console.log('1. Translation List:');
    const translationData = await fetchV2List('translation');
    if (translationData) {
        displayV2List(translationData, 'translation');
    }
    console.log();
    
    // Test recitor list
    console.log('2. Recitor List:');
    const recitorData = await fetchV2List('recitor');
    if (recitorData) {
        displayV2List(recitorData, 'recitor');
    }
    console.log();
    
    // Test quran list
    console.log('3. Quran List:');
    const quranData = await fetchV2List('quran');
    if (quranData) {
        displayV2List(quranData, 'quran');
    }
    console.log();
    
    // Compare APIs
    compareV1V2();
    
    // Example usage
    if (translationData) {
        console.log('\nExample usage:');
        console.log('const translations = await fetchV2List("translation");');
        console.log('const translation = getItemById(translations, "translation", "en.sahih");');
        console.log('const englishTranslations = getItemsByLanguage(translations, "translation", "English");');
    }
}

// Run the example
main();

// Expected Response Structure (v2 API):
// {
//   "translation": {
//     "en.sahih": {
//       "name": "Sahih International",
//       "language": "English",
//       "author": "Sahih International",
//       "version": "1.0"
//     }
//   },
//   "meta": {
//     "api_version": "2.0",
//     "total_count": 150,
//     "last_updated": "2024-01-01T00:00:00Z"
//   }
// }
