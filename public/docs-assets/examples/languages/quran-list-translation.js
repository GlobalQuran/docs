// JavaScript Example: Translation List
// This example shows how to fetch available translations using the GlobalQuran API

// API Endpoint
const endpoint = 'https://api.globalquran.com/v1/list/translation?key=REPLACE_WITH_YOUR_KEY';

// Function to fetch translations
async function fetchTranslations() {
    try {
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching translations:', error);
        return null;
    }
}

// Function to display translations
function displayTranslations(data) {
    if (!data || !data.translation) {
        console.log('No translation data available');
        return;
    }
    
    const translations = data.translation;
    console.log('Available Translations:');
    console.log('=======================');
    
    Object.keys(translations).forEach(translationId => {
        const translation = translations[translationId];
        console.log(`ID: ${translationId}`);
        console.log(`Name: ${translation.name || 'N/A'}`);
        console.log(`Language: ${translation.language || 'N/A'}`);
        console.log(`Author: ${translation.author || 'N/A'}`);
        console.log('---');
    });
}

// Function to get translation by ID
function getTranslationById(data, translationId) {
    if (!data || !data.translation || !data.translation[translationId]) {
        return null;
    }
    
    return data.translation[translationId];
}

// Function to filter translations by language
function getTranslationsByLanguage(data, language) {
    if (!data || !data.translation) {
        return [];
    }
    
    return Object.entries(data.translation)
        .filter(([id, translation]) => translation.language === language)
        .map(([id, translation]) => ({ id, ...translation }));
}

// Function to get translations by author
function getTranslationsByAuthor(data, author) {
    if (!data || !data.translation) {
        return [];
    }
    
    return Object.entries(data.translation)
        .filter(([id, translation]) => translation.author && translation.author.includes(author))
        .map(([id, translation]) => ({ id, ...translation }));
}

// Function to search translations by name
function searchTranslations(data, searchTerm) {
    if (!data || !data.translation) {
        return [];
    }
    
    const term = searchTerm.toLowerCase();
    return Object.entries(data.translation)
        .filter(([id, translation]) => 
            translation.name && translation.name.toLowerCase().includes(term)
        )
        .map(([id, translation]) => ({ id, ...translation }));
}

// Main execution
async function main() {
    console.log('Fetching available translations...');
    const data = await fetchTranslations();
    
    if (data) {
        displayTranslations(data);
        
        // Example: Get specific translation
        const translation = getTranslationById(data, 'en.sahih');
        if (translation) {
            console.log('\nSpecific Translation (en.sahih):');
            console.log(`Name: ${translation.name}`);
            console.log(`Language: ${translation.language}`);
            console.log(`Author: ${translation.author}`);
        }
        
        // Example: Filter by language
        const englishTranslations = getTranslationsByLanguage(data, 'English');
        console.log(`\nEnglish Translations: ${englishTranslations.length}`);
        
        // Example: Search by name
        const sahihTranslations = searchTranslations(data, 'sahih');
        console.log(`Translations containing "sahih": ${sahihTranslations.length}`);
        
        console.log('\nExample usage:');
        console.log('const translations = await fetchTranslations();');
        console.log('const translation = getTranslationById(translations, "en.sahih");');
        console.log('const englishTranslations = getTranslationsByLanguage(translations, "English");');
        console.log('const searchResults = searchTranslations(translations, "sahih");');
    } else {
        console.log('Failed to fetch translations');
    }
}

// Run the example
main();

// Expected Response Structure:
// {
//   "translation": {
//     "en.sahih": {
//       "name": "Sahih International",
//       "language": "English",
//       "author": "Sahih International"
//     },
//     "en.pickthall": {
//       "name": "Pickthall",
//       "language": "English", 
//       "author": "Mohammed Marmaduke William Pickthall"
//     },
//     "ar.jalalayn": {
//       "name": "Tafsir al-Jalalayn",
//       "language": "Arabic",
//       "author": "Jalal ad-Din al-Mahalli and Jalal ad-Din as-Suyuti"
//     }
//   }
// }
