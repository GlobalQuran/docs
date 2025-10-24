<?php
// v2 Translations List - PHP Example
// This example demonstrates how to fetch and display translations using the v2 API

// Configuration
$apiBase = 'https://api.globalquran.com/v2';
$apiKey = 'REPLACE_WITH_YOUR_KEY'; // Replace with your actual API key

// Fetch translations from v2 API
function fetchTranslations($apiKey) {
    $url = $apiBase . '/list/translation?key=' . $apiKey;
    
    // Initialize cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'User-Agent: PHP-v2-Translations-Example'
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

// Display translations list
function displayTranslations($data) {
    echo "=== v2 TRANSLATIONS API RESPONSE ===\n";
    echo "Raw JSON Response:\n";
    echo json_encode($data, JSON_PRETTY_PRINT) . "\n\n";
    
    if (isset($data['list']) && is_array($data['list'])) {
        $translations = array_values($data['list']);
        echo "Found " . count($translations) . " translations\n\n";
        
        // Display each translation with full details
        foreach ($translations as $index => $translation) {
            $translationId = array_keys($data['list'])[$index];
            echo "Translation " . ($index + 1) . ":\n";
            echo "  ID: " . $translationId . "\n";
            echo "  Name: " . ($translation['name'] ?? 'N/A') . "\n";
            echo "  English Name: " . ($translation['english_name'] ?? 'N/A') . "\n";
            echo "  Native Name: " . ($translation['native_name'] ?? 'N/A') . "\n";
            echo "  Language Code: " . ($translation['language_code'] ?? 'N/A') . "\n";
            echo "  Type: " . ($translation['type'] ?? 'N/A') . "\n";
            echo "  Format: " . ($translation['format'] ?? 'N/A') . "\n";
            echo "  Source: " . ($translation['source'] ?? 'N/A') . "\n";
            echo "  Default: " . ($translation['default'] ? 'Yes' : 'No') . "\n";
            echo "  Supported Version: " . ($translation['supported_version'] ?? 'N/A') . "\n\n";
        }
        
        return $translations;
    } else {
        echo "No translation data found\n";
        return [];
    }
}

// Filter translations by language
function filterByLanguage($translations, $languageCode) {
    return array_filter($translations, function($translation) use ($languageCode) {
        return ($translation['language_code'] ?? '') === $languageCode;
    });
}

// Get default translations
function getDefaultTranslations($translations) {
    return array_filter($translations, function($translation) {
        return ($translation['default'] ?? false) === true;
    });
}

// Example usage
try {
    echo "Fetching translations from v2 API...\n\n";
    $data = fetchTranslations($apiKey);
    
    $translations = displayTranslations($data);
    
    // Example: Filter by language
    if (!empty($translations)) {
        echo "=== FILTERING EXAMPLES ===\n";
        
        // Get English translations
        $englishTranslations = filterByLanguage($translations, 'en');
        echo "English translations: " . count($englishTranslations) . "\n";
        
        // Get Arabic translations
        $arabicTranslations = filterByLanguage($translations, 'ar');
        echo "Arabic translations: " . count($arabicTranslations) . "\n";
        
        // Get default translations
        $defaultTranslations = getDefaultTranslations($translations);
        echo "Default translations: " . count($defaultTranslations) . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
