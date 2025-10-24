<?php
// PHP Example: Quran List
// This example shows how to fetch the list of available Quran resources

// API Endpoint
$endpoint = 'https://api.globalquran.com/v1/quran?key=REPLACE_WITH_YOUR_KEY';

/**
 * Function to fetch Quran list
 * @return array|false Returns array on success, false on failure
 */
function fetchQuranList() {
    $url = 'https://api.globalquran.com/v1/quran?key=REPLACE_WITH_YOUR_KEY';
    
    // Using cURL for HTTP request
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        error_log("HTTP error! status: {$httpCode}");
        return false;
    }
    
    $data = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("JSON decode error: " . json_last_error_msg());
        return false;
    }
    
    return $data;
}

/**
 * Function to display Quran list
 * @param array $data API response data
 */
function displayQuranList($data) {
    if (!isset($data['quranList']) || empty($data['quranList'])) {
        echo "No Quran list found\n";
        return;
    }
    
    echo "Available Quran Resources:\n";
    echo "========================\n";
    
    foreach ($data['quranList'] as $quranId => $quranData) {
        if ($quranData['format'] === 'text' && $quranData['type'] === 'quran') {
            echo "ID: {$quranId}\n";
            echo "Name: {$quranData['english_name']}\n";
            echo "Native Name: {$quranData['native_name']}\n";
            echo "Language: {$quranData['language']}\n";
            echo "---\n";
        }
    }
}

/**
 * Function to display translations
 * @param array $data API response data
 */
function displayTranslations($data) {
    if (!isset($data['quranList']) || empty($data['quranList'])) {
        echo "No translations found\n";
        return;
    }
    
    echo "\nAvailable Translations:\n";
    echo "=====================\n";
    
    foreach ($data['quranList'] as $quranId => $quranData) {
        if ($quranData['format'] === 'text' && $quranData['type'] === 'translation') {
            echo "ID: {$quranId}\n";
            echo "Name: {$quranData['english_name']}\n";
            echo "Native Name: {$quranData['native_name']}\n";
            echo "Language: {$quranData['language']}\n";
            echo "---\n";
        }
    }
}

/**
 * Function to display recitors
 * @param array $data API response data
 */
function displayRecitors($data) {
    if (!isset($data['quranList']) || empty($data['quranList'])) {
        echo "No recitors found\n";
        return;
    }
    
    echo "\nAvailable Recitors:\n";
    echo "==================\n";
    
    foreach ($data['quranList'] as $quranId => $quranData) {
        if ($quranData['format'] === 'audio') {
            echo "ID: {$quranId}\n";
            echo "Name: {$quranData['english_name']}\n";
            echo "Native Name: {$quranData['native_name']}\n";
            echo "Language: {$quranData['language']}\n";
            echo "---\n";
        }
    }
}

// Usage example
try {
    $quranListData = fetchQuranList();
    
    if ($quranListData !== false) {
        displayQuranList($quranListData);
        displayTranslations($quranListData);
        displayRecitors($quranListData);
    } else {
        echo "Failed to fetch Quran list\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

// Expected Response Structure:
// Array (
//   [quranList] => Array (
//     [quran-simple] => Array (
//       [name] => Quran Simple
//       [english_name] => Quran Simple
//       [native_name] => القرآن الكريم
//       [language] => ar
//       [format] => text
//       [type] => quran
//     )
//     [en.sahih] => Array (
//       [name] => Sahih International
//       [english_name] => Sahih International
//       [native_name] => Sahih International
//       [language] => en
//       [format] => text
//       [type] => translation
//     )
//     [abdul_basit_murattal] => Array (
//       [name] => Abdul Basit Murattal
//       [english_name] => Abdul Basit Murattal
//       [native_name] => عبد الباسط مرتل
//       [language] => ar
//       [format] => audio
//       [type] => recitor
//     )
//   )
// )
?>
