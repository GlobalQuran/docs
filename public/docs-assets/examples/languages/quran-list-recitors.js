// JavaScript Example: Recitor List
// This example shows how to fetch available recitors using the GlobalQuran API

// API Endpoint
const endpoint = 'https://api.globalquran.com/v1/list/recitor?key=YOUR_API_KEY';

// Function to fetch recitors
async function fetchRecitors() {
    try {
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching recitors:', error);
        return null;
    }
}

// Function to display recitors
function displayRecitors(data) {
    if (!data || !data.recitor) {
        console.log('No recitor data available');
        return;
    }
    
    const recitors = data.recitor;
    console.log('Available Recitors:');
    console.log('==================');
    
    Object.keys(recitors).forEach(recitorId => {
        const recitor = recitors[recitorId];
        console.log(`ID: ${recitorId}`);
        console.log(`Name: ${recitor.name || 'N/A'}`);
        console.log(`Language: ${recitor.language || 'N/A'}`);
        console.log(`Style: ${recitor.style || 'N/A'}`);
        console.log('---');
    });
}

// Function to get recitor by ID
function getRecitorById(data, recitorId) {
    if (!data || !data.recitor || !data.recitor[recitorId]) {
        return null;
    }
    
    return data.recitor[recitorId];
}

// Function to filter recitors by language
function getRecitorsByLanguage(data, language) {
    if (!data || !data.recitor) {
        return [];
    }
    
    return Object.entries(data.recitor)
        .filter(([id, recitor]) => recitor.language === language)
        .map(([id, recitor]) => ({ id, ...recitor }));
}

// Main execution
async function main() {
    console.log('Fetching available recitors...');
    const data = await fetchRecitors();
    
    if (data) {
        displayRecitors(data);
        
        // Example: Get specific recitor
        const recitor = getRecitorById(data, 'abdul_basit_murattal');
        if (recitor) {
            console.log('\nSpecific Recitor (abdul_basit_murattal):');
            console.log(`Name: ${recitor.name}`);
            console.log(`Language: ${recitor.language}`);
            console.log(`Style: ${recitor.style}`);
        }
        
        // Example: Filter by language
        const arabicRecitors = getRecitorsByLanguage(data, 'Arabic');
        console.log(`\nArabic Recitors: ${arabicRecitors.length}`);
        
        console.log('\nExample usage:');
        console.log('const recitors = await fetchRecitors();');
        console.log('const recitor = getRecitorById(recitors, "abdul_basit_murattal");');
        console.log('const arabicRecitors = getRecitorsByLanguage(recitors, "Arabic");');
    } else {
        console.log('Failed to fetch recitors');
    }
}

// Run the example
main();

// Expected Response Structure:
// {
//   "recitor": {
//     "abdul_basit_murattal": {
//       "name": "Abdul Basit Murattal",
//       "language": "Arabic",
//       "style": "Murattal"
//     },
//     "abdul_basit_mujawwad": {
//       "name": "Abdul Basit Mujawwad", 
//       "language": "Arabic",
//       "style": "Mujawwad"
//     }
//   }
// }
