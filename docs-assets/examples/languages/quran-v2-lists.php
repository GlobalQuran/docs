<?php
/**
 * GlobalQuran v2 API Lists - PHP Example
 * 
 * This example demonstrates how to fetch lists of translations, recitors, and Quran texts
 * using the GlobalQuran v2 API with PHP.
 */

// Configuration
$apiBase = 'https://api.globalquran.com/v2';
$apiKey = 'REPLACE_WITH_YOUR_KEY'; // Replace with your actual API key

/**
 * Fetch data from GlobalQuran v2 API
 */
function fetchFromAPI($endpoint, $apiKey) {
    $url = $endpoint . '?key=' . $apiKey;
    
    // Initialize cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'User-Agent: GlobalQuran PHP Example/1.0'
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

/**
 * Display translations list
 */
function displayTranslations($data) {
    if (isset($data['list']) && is_array($data['list'])) {
        $items = array_values($data['list']);
        echo "<h3>Available Translations (v2)</h3>\n";
        echo "<p><strong>Found " . count($items) . " translations</strong></p>\n";
        echo "<ul>\n";
        
        foreach ($items as $item) {
            echo "<li>\n";
            echo "<strong>" . htmlspecialchars($item['name'] ?? 'Unknown') . "</strong><br>\n";
            echo "ID: " . htmlspecialchars($item['language_code'] ?? 'N/A') . " | ";
            echo "Language: " . htmlspecialchars($item['language_code'] ?? 'N/A') . " | ";
            echo "Author: " . htmlspecialchars($item['english_name'] ?? 'N/A') . "\n";
            echo "</li>\n";
        }
        
        echo "</ul>\n";
    } else {
        echo "<p style='color: red;'>No translation data found</p>\n";
    }
}

/**
 * Display recitors list
 */
function displayRecitors($data) {
    if (isset($data['list']) && is_array($data['list'])) {
        $items = array_values($data['list']);
        echo "<h3>Available Recitors (v2)</h3>\n";
        echo "<p><strong>Found " . count($items) . " recitors</strong></p>\n";
        echo "<ul>\n";
        
        foreach ($items as $item) {
            echo "<li>\n";
            echo "<strong>" . htmlspecialchars($item['name'] ?? 'Unknown') . "</strong><br>\n";
            echo "ID: " . htmlspecialchars($item['language_code'] ?? 'N/A') . " | ";
            echo "Language: " . htmlspecialchars($item['language_code'] ?? 'N/A') . " | ";
            echo "Style: " . htmlspecialchars($item['type'] ?? 'N/A') . "\n";
            echo "</li>\n";
        }
        
        echo "</ul>\n";
    } else {
        echo "<p style='color: red;'>No recitor data found</p>\n";
    }
}

/**
 * Display Quran texts list
 */
function displayQuranTexts($data) {
    if (isset($data['list']) && is_array($data['list'])) {
        $items = array_values($data['list']);
        echo "<h3>Available Quran Texts (v2)</h3>\n";
        echo "<p><strong>Found " . count($items) . " Quran texts</strong></p>\n";
        echo "<ul>\n";
        
        foreach ($items as $item) {
            echo "<li>\n";
            echo "<strong>" . htmlspecialchars($item['name'] ?? 'Unknown') . "</strong><br>\n";
            echo "ID: " . htmlspecialchars($item['language_code'] ?? 'N/A') . " | ";
            echo "Language: " . htmlspecialchars($item['language_code'] ?? 'N/A') . " | ";
            echo "Type: " . htmlspecialchars($item['type'] ?? 'N/A') . "\n";
            echo "</li>\n";
        }
        
        echo "</ul>\n";
    } else {
        echo "<p style='color: red;'>No Quran text data found</p>\n";
    }
}

// Main execution
echo "<!DOCTYPE html>\n";
echo "<html>\n<head>\n";
echo "<meta charset='UTF-8'>\n";
echo "<title>GlobalQuran v2 API Lists - PHP Example</title>\n";
echo "<style>\n";
echo "body { font-family: Arial, sans-serif; margin: 20px; background: #f8f9fa; }\n";
echo ".container { max-width: 1200px; margin: 0 auto; }\n";
echo ".section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }\n";
echo ".section h2 { color: #2c5aa0; border-bottom: 2px solid #2c5aa0; padding-bottom: 10px; }\n";
echo ".error { color: red; background: #ffe6e6; padding: 10px; border-radius: 4px; }\n";
echo ".success { color: green; background: #e6ffe6; padding: 10px; border-radius: 4px; }\n";
echo "ul { list-style-type: none; padding: 0; }\n";
echo "li { padding: 8px 0; border-bottom: 1px solid #eee; }\n";
echo "li:last-child { border-bottom: none; }\n";
echo "</style>\n";
echo "</head>\n<body>\n";

echo "<div class='container'>\n";
echo "<h1>GlobalQuran v2 API Lists Demo - PHP</h1>\n";
echo "<p>This example demonstrates the new v2 API endpoints for listing translations, recitors, and Quran texts using PHP.</p>\n";

try {
    // Fetch and display translations
    echo "<div class='section'>\n";
    $translationsData = fetchFromAPI($apiBase . '/list/translation', $apiKey);
    displayTranslations($translationsData);
    echo "</div>\n";
    
    // Fetch and display recitors
    echo "<div class='section'>\n";
    $recitorsData = fetchFromAPI($apiBase . '/list/recitor', $apiKey);
    displayRecitors($recitorsData);
    echo "</div>\n";
    
    // Fetch and display Quran texts
    echo "<div class='section'>\n";
    $quranTextsData = fetchFromAPI($apiBase . '/list/quran', $apiKey);
    displayQuranTexts($quranTextsData);
    echo "</div>\n";
    
} catch (Exception $e) {
    echo "<div class='error'>Error: " . htmlspecialchars($e->getMessage()) . "</div>\n";
}

echo "</div>\n";
echo "</body>\n</html>\n";
?>
