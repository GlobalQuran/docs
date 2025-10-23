<?php
// PHP Example: Quran by Surah
// This example shows how to fetch a specific Surah using the GlobalQuran API

// API Endpoint
$endpoint = 'https://api.globalquran.com/v1/surah/1/quran-simple?key=YOUR_API_KEY';

/**
 * Function to fetch Surah data
 * @param int $surahNumber Surah number (1-114)
 * @param string $quranId Quran ID (default: 'quran-simple')
 * @return array|false Returns array on success, false on failure
 */
function fetchSurah($surahNumber = 1, $quranId = 'quran-simple') {
    $url = "https://api.globalquran.com/v1/surah/{$surahNumber}/{$quranId}?key=YOUR_API_KEY";
    
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
 * Function to display Surah verses
 * @param array $data API response data
 */
function displaySurah($data) {
    if (!isset($data['quran']) || empty($data['quran'])) {
        echo "No Quran data found\n";
        return;
    }
    
    // Process the response data
    foreach ($data['quran'] as $surah) {
        foreach ($surah as $verse) {
            echo "{$verse['surah']}:{$verse['ayah']} {$verse['verse']}\n";
        }
    }
}

// Usage example
try {
    $surahData = fetchSurah(1); // Al-Fatiha
    
    if ($surahData !== false) {
        displaySurah($surahData);
    } else {
        echo "Failed to fetch Surah data\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

// Expected Response Structure:
// Array (
//   [quran] => Array (
//     [1] => Array (
//       [1] => Array (
//         [surah] => 1
//         [ayah] => 1
//         [verse] => بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
//       )
//       [2] => Array (
//         [surah] => 1
//         [ayah] => 2
//         [verse] => الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
//       )
//       [3] => Array (
//         [surah] => 1
//         [ayah] => 3
//         [verse] => الرَّحْمَٰنِ الرَّحِيمِ
//       )
//       [4] => Array (
//         [surah] => 1
//         [ayah] => 4
//         [verse] => مَالِكِ يَوْمِ الدِّينِ
//       )
//       [5] => Array (
//         [surah] => 1
//         [ayah] => 5
//         [verse] => إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
//       )
//       [6] => Array (
//         [surah] => 1
//         [ayah] => 6
//         [verse] => اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
//       )
//       [7] => Array (
//         [surah] => 1
//         [ayah] => 7
//         [verse] => صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ
//       )
//     )
//   )
// )
?>
