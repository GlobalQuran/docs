<?php
// v2 Quran List - PHP Example
// This example demonstrates how to fetch and display Quran formats using the v2 API

// Configuration
$apiBase = 'https://api.globalquran.com/v2';
$apiKey = 'REPLACE_WITH_YOUR_KEY'; // Replace with your actual API key

// Fetch Quran formats from v2 API
function fetchQuranFormats($apiKey) {
    $url = $apiBase . '/list/quran?key=' . $apiKey;
    
    // Initialize cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'User-Agent: PHP-v2-Quran-Example'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception("cURL Error: " . $error);
    }
    
    if ($httpCode !== 200) {
        throw new Exception("HTTP Error: " . $httpCode);
    }
    
    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("JSON Decode Error: " . json_last_error_msg());
    }
    
    return $data;
}

// Display Quran formats list
function displayQuranFormats($data) {
    echo "=== v2 QURAN FORMATS API RESPONSE ===\n";
    echo "Raw JSON Response:\n";
    echo json_encode($data, JSON_PRETTY_PRINT) . "\n\n";
    
    if (isset($data['list']) && is_array($data['list'])) {
        $quranFormats = array_values($data['list']);
        echo "Found " . count($quranFormats) . " Quran formats\n\n";
        
        // Display each Quran format with full details
        foreach ($quranFormats as $index => $quranFormat) {
            $quranId = array_keys($data['list'])[$index];
            echo "Quran Format " . ($index + 1) . ":\n";
            echo "  ID: " . $quranId . "\n";
            echo "  Name: " . ($quranFormat['name'] ?? 'N/A') . "\n";
            echo "  English Name: " . ($quranFormat['english_name'] ?? 'N/A') . "\n";
            echo "  Native Name: " . ($quranFormat['native_name'] ?? 'N/A') . "\n";
            echo "  Language Code: " . ($quranFormat['language_code'] ?? 'N/A') . "\n";
            echo "  Type: " . ($quranFormat['type'] ?? 'N/A') . "\n";
            echo "  Format: " . ($quranFormat['format'] ?? 'N/A') . "\n";
            echo "  Source: " . ($quranFormat['source'] ?? 'N/A') . "\n";
            echo "  Default: " . ($quranFormat['default'] ? 'Yes' : 'No') . "\n";
            echo "  Supported Version: " . ($quranFormat['supported_version'] ?? 'N/A') . "\n\n";
        }
        
        return $quranFormats;
    } else {
        echo "No Quran format data found\n";
        return [];
    }
}

// Filter Quran formats by language
function filterByLanguage($quranFormats, $languageCode) {
    return array_filter($quranFormats, function($format) use ($languageCode) {
        return ($format['language_code'] ?? '') === $languageCode;
    });
}

// Get default Quran formats
function getDefaultFormats($quranFormats) {
    return array_filter($quranFormats, function($format) {
        return ($format['default'] ?? false) === true;
    });
}

// Get formats by type
function getFormatsByType($quranFormats, $type) {
    return array_filter($quranFormats, function($format) use ($type) {
        return ($format['type'] ?? '') === $type;
    });
}

// Example usage
try {
    echo "Fetching Quran formats from v2 API...\n\n";
    $data = fetchQuranFormats($apiKey);
    
    $quranFormats = displayQuranFormats($data);
    
    // Example: Filter by language
    if (!empty($quranFormats)) {
        echo "=== FILTERING EXAMPLES ===\n";
        
        // Get Arabic formats
        $arabicFormats = filterByLanguage($quranFormats, 'ar');
        echo "Arabic formats: " . count($arabicFormats) . "\n";
        
        // Get English formats
        $englishFormats = filterByLanguage($quranFormats, 'en');
        echo "English formats: " . count($englishFormats) . "\n";
        
        // Get default formats
        $defaultFormats = getDefaultFormats($quranFormats);
        echo "Default formats: " . count($defaultFormats) . "\n";
        
        // Get translation formats
        $translationFormats = getFormatsByType($quranFormats, 'translation');
        echo "Translation formats: " . count($translationFormats) . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
