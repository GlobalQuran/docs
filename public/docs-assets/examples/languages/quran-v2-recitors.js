// v2 Recitors List - Modern JavaScript Example
// This example demonstrates how to fetch and display recitors using the v2 API

// Configuration
const API_BASE = 'https://api.globalquran.com/v2';
const API_KEY = 'REPLACE_WITH_YOUR_KEY'; // Replace with your actual API key

// Fetch recitors from v2 API
async function fetchRecitors() {
    try {
        const response = await fetch(`${API_BASE}/list/recitor?key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching recitors:', error);
        throw error;
    }
}

// Display recitors list
function displayRecitors(data) {
    console.log('Raw API Response:', data);
    
    if (data.list && typeof data.list === 'object') {
        const recitors = Object.values(data.list);
        console.log(`Found ${recitors.length} recitors`);
        
        // Display each recitor with full details
        recitors.forEach((recitor, index) => {
            const recitorId = Object.keys(data.list)[index];
            console.log(`\nRecitor ${index + 1}:`);
            console.log(`  ID: ${recitorId}`);
            console.log(`  Name: ${recitor.name}`);
            console.log(`  English Name: ${recitor.english_name}`);
            console.log(`  Language: ${recitor.language_code}`);
            console.log(`  Type: ${recitor.type}`);
            console.log(`  Format: ${recitor.format}`);
            console.log(`  Default: ${recitor.default}`);
            
            // Display media formats
            if (recitor.media) {
                console.log('  Available Formats:');
                Object.entries(recitor.media).forEach(([format, details]) => {
                    console.log(`    ${format}:`);
                    console.log(`      Type: ${details.type}`);
                    console.log(`      Bitrate: ${details.kbs}kbps`);
                    console.log(`      Source: ${details.source}`);
                    console.log(`      Status: ${details.status}`);
                });
            }
        });
        
        return recitors;
    } else {
        console.log('No recitor data found');
        return [];
    }
}

// Get best audio format based on browser support
function getBestAudioFormat(mediaInfo) {
    if (!mediaInfo || Object.keys(mediaInfo).length === 0) {
        return null;
    }

    // Check if browser supports ogg format
    const supportsOgg = typeof Audio !== "undefined" && new Audio().canPlayType("audio/ogg") !== "";

    // Available formats in order of preference
    const formats = [];

    // If we have ogg support and the format is available, prefer it
    if (supportsOgg) {
        if (mediaInfo["ogg-192"]) formats.push(mediaInfo["ogg-192"]);
        if (mediaInfo["ogg-128"]) formats.push(mediaInfo["ogg-128"]);
        if (mediaInfo["ogg-64"]) formats.push(mediaInfo["ogg-64"]);
        if (mediaInfo["ogg-32"]) formats.push(mediaInfo["ogg-32"]);
    }

    // For MP3 formats, prefer higher quality first
    if (mediaInfo["mp3-192"]) formats.push(mediaInfo["mp3-192"]);
    if (mediaInfo["mp3-128"]) formats.push(mediaInfo["mp3-128"]);
    if (mediaInfo["mp3-64"]) formats.push(mediaInfo["mp3-64"]);
    if (mediaInfo["mp3-32"]) formats.push(mediaInfo["mp3-32"]);

    return formats.length > 0 ? formats[0] : null;
}

// Construct audio URL
function constructAudioUrl(recitorId, mediaInfo) {
    const bestFormat = getBestAudioFormat(mediaInfo);
    
    if (bestFormat) {
        const fileExtension = bestFormat.type === 'ogg' ? 'ogg' : 'mp3';
        return `https://audio.globalquran.com/${recitorId}/${bestFormat.type}/${bestFormat.kbs}kbs/1.${fileExtension}`;
    } else {
        // Fallback
        return `https://audio.globalquran.com/${recitorId}/mp3/128kbs/1.mp3`;
    }
}

// Example usage
async function main() {
    try {
        console.log('Fetching recitors from v2 API...');
        const data = await fetchRecitors();
        
        console.log('\n=== RECITORS LIST ===');
        const recitors = displayRecitors(data);
        
        // Example: Get audio URL for first recitor
        if (recitors.length > 0) {
            const firstRecitor = recitors[0];
            const recitorId = Object.keys(data.list)[0];
            
            console.log('\n=== AUDIO URL EXAMPLE ===');
            console.log(`Recitor: ${firstRecitor.name}`);
            console.log(`Available formats:`, Object.keys(firstRecitor.media || {}));
            
            const audioUrl = constructAudioUrl(recitorId, firstRecitor.media);
            console.log(`Best audio URL: ${audioUrl}`);
        }
        
    } catch (error) {
        console.error('Error in main:', error);
    }
}

// Run the example
main();
