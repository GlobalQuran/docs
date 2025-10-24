// v2 Quran List - Modern JavaScript Example
// This example demonstrates how to fetch and display Quran formats using the v2 API

// Configuration
const API_BASE = 'https://api.globalquran.com/v2';
const API_KEY = 'REPLACE_WITH_YOUR_KEY'; // Replace with your actual API key

// Fetch Quran formats from v2 API
async function fetchQuranFormats() {
    try {
        const response = await fetch(`${API_BASE}/list/quran?key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Quran formats:', error);
        throw error;
    }
}

// Display Quran formats list
function displayQuranFormats(data) {
    console.log('Raw API Response:', data);
    
    if (data.list && typeof data.list === 'object') {
        const quranFormats = Object.values(data.list);
        console.log(`Found ${quranFormats.length} Quran formats`);
        
        // Display each Quran format with full details
        quranFormats.forEach((quranFormat, index) => {
            const quranId = Object.keys(data.list)[index];
            console.log(`\nQuran Format ${index + 1}:`);
            console.log(`  ID: ${quranId}`);
            console.log(`  Name: ${quranFormat.name}`);
            console.log(`  English Name: ${quranFormat.english_name}`);
            console.log(`  Native Name: ${quranFormat.native_name}`);
            console.log(`  Language Code: ${quranFormat.language_code}`);
            console.log(`  Type: ${quranFormat.type}`);
            console.log(`  Format: ${quranFormat.format}`);
            console.log(`  Source: ${quranFormat.source}`);
            console.log(`  Default: ${quranFormat.default}`);
            console.log(`  Supported Version: ${quranFormat.supported_version}`);
        });
        
        return quranFormats;
    } else {
        console.log('No Quran format data found');
        return [];
    }
}

// Filter Quran formats by language
function filterByLanguage(quranFormats, languageCode) {
    return quranFormats.filter(format => 
        format.language_code === languageCode
    );
}

// Get default Quran formats
function getDefaultFormats(quranFormats) {
    return quranFormats.filter(format => format.default === true);
}

// Get formats by type
function getFormatsByType(quranFormats, type) {
    return quranFormats.filter(format => format.type === type);
}

// Example usage
async function main() {
    try {
        console.log('Fetching Quran formats from v2 API...');
        const data = await fetchQuranFormats();
        
        console.log('\n=== QURAN FORMATS LIST ===');
        const quranFormats = displayQuranFormats(data);
        
        // Example: Filter by language
        if (quranFormats.length > 0) {
            console.log('\n=== FILTERING EXAMPLES ===');
            
            // Get Arabic formats
            const arabicFormats = filterByLanguage(quranFormats, 'ar');
            console.log(`Arabic formats: ${arabicFormats.length}`);
            
            // Get English formats
            const englishFormats = filterByLanguage(quranFormats, 'en');
            console.log(`English formats: ${englishFormats.length}`);
            
            // Get default formats
            const defaultFormats = getDefaultFormats(quranFormats);
            console.log(`Default formats: ${defaultFormats.length}`);
            
            // Get translation formats
            const translationFormats = getFormatsByType(quranFormats, 'translation');
            console.log(`Translation formats: ${translationFormats.length}`);
        }
        
    } catch (error) {
        console.error('Error in main:', error);
    }
}

// Run the example
main();
