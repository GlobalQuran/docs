// v2 Translations List - Modern JavaScript Example
// This example demonstrates how to fetch and display translations using the v2 API

// Configuration
const API_BASE = 'https://api.globalquran.com/v2';
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

// Fetch translations from v2 API
async function fetchTranslations() {
    try {
        const response = await fetch(`${API_BASE}/list/translation?key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching translations:', error);
        throw error;
    }
}

// Display translations list
function displayTranslations(data) {
    console.log('Raw API Response:', data);
    
    if (data.list && typeof data.list === 'object') {
        const translations = Object.values(data.list);
        console.log(`Found ${translations.length} translations`);
        
        // Display each translation with full details
        translations.forEach((translation, index) => {
            const translationId = Object.keys(data.list)[index];
            console.log(`\nTranslation ${index + 1}:`);
            console.log(`  ID: ${translationId}`);
            console.log(`  Name: ${translation.name}`);
            console.log(`  English Name: ${translation.english_name}`);
            console.log(`  Native Name: ${translation.native_name}`);
            console.log(`  Language Code: ${translation.language_code}`);
            console.log(`  Type: ${translation.type}`);
            console.log(`  Format: ${translation.format}`);
            console.log(`  Source: ${translation.source}`);
            console.log(`  Default: ${translation.default}`);
            console.log(`  Supported Version: ${translation.supported_version}`);
        });
        
        return translations;
    } else {
        console.log('No translation data found');
        return [];
    }
}

// Filter translations by language
function filterByLanguage(translations, languageCode) {
    return translations.filter(translation => 
        translation.language_code === languageCode
    );
}

// Get default translations
function getDefaultTranslations(translations) {
    return translations.filter(translation => translation.default === true);
}

// Example usage
async function main() {
    try {
        console.log('Fetching translations from v2 API...');
        const data = await fetchTranslations();
        
        console.log('\n=== TRANSLATIONS LIST ===');
        const translations = displayTranslations(data);
        
        // Example: Filter by language
        if (translations.length > 0) {
            console.log('\n=== FILTERING EXAMPLES ===');
            
            // Get English translations
            const englishTranslations = filterByLanguage(translations, 'en');
            console.log(`English translations: ${englishTranslations.length}`);
            
            // Get Arabic translations
            const arabicTranslations = filterByLanguage(translations, 'ar');
            console.log(`Arabic translations: ${arabicTranslations.length}`);
            
            // Get default translations
            const defaultTranslations = getDefaultTranslations(translations);
            console.log(`Default translations: ${defaultTranslations.length}`);
        }
        
    } catch (error) {
        console.error('Error in main:', error);
    }
}

// Run the example
main();
