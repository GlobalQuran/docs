<?php
/**
 * PHP Example: Quran by Ayah
 * This example shows how to fetch a specific Ayah using the GlobalQuran API
 */

class GlobalQuranAPI {
    private $apiKey;
    private $baseUrl = 'https://api.globalquran.com';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    /**
     * Fetch a specific Ayah from the Quran
     * 
     * @param string $ayahReference Ayah reference in format 'surah:ayah' (e.g., '2:255')
     * @param string $quranId Quran ID (default: 'quran-simple')
     * @return array|null API response data or null if error
     */
    public function fetchAyah($ayahReference, $quranId = 'quran-simple') {
        $url = $this->baseUrl . "/v1/ayah/{$ayahReference}/{$quranId}?key={$this->apiKey}";
        
        $context = stream_context_create([
            'http' => [
                'timeout' => 30,
                'method' => 'GET',
                'header' => 'User-Agent: GlobalQuran-PHP-Client/1.0'
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response === false) {
            echo "Error: Failed to fetch data from API\n";
            return null;
        }
        
        $data = json_decode($response, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo "Error: Invalid JSON response\n";
            return null;
        }
        
        return $data;
    }
    
    /**
     * Display Ayah data in a formatted way
     * 
     * @param array $data API response data
     */
    public function displayAyah($data) {
        if (!$data || !isset($data['quran'])) {
            echo "No Quran data found\n";
            return;
        }
        
        echo str_repeat('=', 50) . "\n";
        foreach ($data['quran'] as $surah) {
            foreach ($surah as $verse) {
                echo "Surah {$verse['surah']}, Ayah {$verse['ayah']}\n";
                echo "Arabic: {$verse['verse']}\n";
                echo str_repeat('-', 30) . "\n";
            }
        }
    }
    
    /**
     * Get Ayah text only
     * 
     * @param array $data API response data
     * @return string Ayah text or empty string
     */
    public function getAyahText($data) {
        if (!$data || !isset($data['quran'])) {
            return '';
        }
        
        foreach ($data['quran'] as $surah) {
            foreach ($surah as $verse) {
                return $verse['verse'];
            }
        }
        return '';
    }
    
    /**
     * Get Ayah metadata (surah, ayah number)
     * 
     * @param array $data API response data
     * @return array|null Ayah metadata or null
     */
    public function getAyahMetadata($data) {
        if (!$data || !isset($data['quran'])) {
            return null;
        }
        
        foreach ($data['quran'] as $surah) {
            foreach ($surah as $verse) {
                return [
                    'surah' => $verse['surah'],
                    'ayah' => $verse['ayah'],
                    'verse' => $verse['verse']
                ];
            }
        }
        return null;
    }
    
    /**
     * Check if API key is valid
     * 
     * @return bool True if API key is valid
     */
    public function validateApiKey() {
        $testData = $this->fetchAyah('1:1');
        return $testData !== null && isset($testData['quran']);
    }
}

// Usage example
function main() {
    // Initialize API client
    $api = new GlobalQuranAPI('REPLACE_WITH_YOUR_KEY');
    
    // Validate API key
    if (!$api->validateApiKey()) {
        echo "Error: Invalid API key or API unavailable\n";
        return;
    }
    
    // Fetch Ayat al-Kursi (2:255)
    echo "Fetching Ayat al-Kursi...\n";
    $ayahData = $api->fetchAyah('2:255');
    
    if ($ayahData) {
        $api->displayAyah($ayahData);
        
        // Get just the text
        $ayahText = $api->getAyahText($ayahData);
        echo "\nAyah Text Only:\n";
        echo $ayahText . "\n";
        
        // Get metadata
        $metadata = $api->getAyahMetadata($ayahData);
        if ($metadata) {
            echo "\nMetadata:\n";
            echo "Surah: {$metadata['surah']}\n";
            echo "Ayah: {$metadata['ayah']}\n";
            echo "Character count: " . mb_strlen($metadata['verse']) . "\n";
            echo "Word count: " . str_word_count($metadata['verse']) . "\n";
        }
    } else {
        echo "Failed to fetch Ayah data\n";
    }
}

// Run the example
if (php_sapi_name() === 'cli') {
    main();
}

/**
 * Expected Response Structure:
 * {
 *   "quran": {
 *     "2": {
 *       "255": {
 *         "surah": 2,
 *         "ayah": 255,
 *         "verse": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ"
 *       }
 *     }
 *   }
 * }
 */
?>
