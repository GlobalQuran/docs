<?php
// v2 Recitors List - PHP Example
// This example demonstrates how to fetch and display recitors using the v2 API

// Configuration
$apiBase = 'https://api.globalquran.com/v2';
$apiKey = 'YOUR_API_KEY'; // Replace with your actual API key

// Fetch recitors from v2 API
function fetchRecitors($apiKey) {
    $url = $apiBase . '/list/recitor?key=' . $apiKey;
    
    // Initialize cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'User-Agent: PHP-v2-Recitors-Example'
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

// Display recitors list
function displayRecitors($data) {
    echo "=== v2 RECITORS API RESPONSE ===\n";
    echo "Raw JSON Response:\n";
    echo json_encode($data, JSON_PRETTY_PRINT) . "\n\n";
    
    if (isset($data['list']) && is_array($data['list'])) {
        $recitors = array_values($data['list']);
        echo "Found " . count($recitors) . " recitors\n\n";
        
        // Display each recitor with full details
        foreach ($recitors as $index => $recitor) {
            $recitorId = array_keys($data['list'])[$index];
            echo "Recitor " . ($index + 1) . ":\n";
            echo "  ID: " . $recitorId . "\n";
            echo "  Name: " . ($recitor['name'] ?? 'N/A') . "\n";
            echo "  English Name: " . ($recitor['english_name'] ?? 'N/A') . "\n";
            echo "  Language: " . ($recitor['language_code'] ?? 'N/A') . "\n";
            echo "  Type: " . ($recitor['type'] ?? 'N/A') . "\n";
            echo "  Format: " . ($recitor['format'] ?? 'N/A') . "\n";
            echo "  Default: " . ($recitor['default'] ? 'Yes' : 'No') . "\n";
            
            // Display media formats
            if (isset($recitor['media']) && is_array($recitor['media'])) {
                echo "  Available Formats:\n";
                foreach ($recitor['media'] as $format => $details) {
                    echo "    " . $format . ":\n";
                    echo "      Type: " . ($details['type'] ?? 'N/A') . "\n";
                    echo "      Bitrate: " . ($details['kbs'] ?? 'N/A') . "kbps\n";
                    echo "      Source: " . ($details['source'] ?? 'N/A') . "\n";
                    echo "      Status: " . ($details['status'] ?? 'N/A') . "\n";
                }
            }
            echo "\n";
        }
        
        return $recitors;
    } else {
        echo "No recitor data found\n";
        return [];
    }
}

// Get best audio format based on available formats
function getBestAudioFormat($mediaInfo) {
    if (empty($mediaInfo) || !is_array($mediaInfo)) {
        return null;
    }

    // Available formats in order of preference
    $formats = [];

    // OGG formats (preferred for better quality/size ratio)
    if (isset($mediaInfo['ogg-192'])) $formats[] = $mediaInfo['ogg-192'];
    if (isset($mediaInfo['ogg-128'])) $formats[] = $mediaInfo['ogg-128'];
    if (isset($mediaInfo['ogg-64'])) $formats[] = $mediaInfo['ogg-64'];
    if (isset($mediaInfo['ogg-32'])) $formats[] = $mediaInfo['ogg-32'];

    // MP3 formats (fallback)
    if (isset($mediaInfo['mp3-192'])) $formats[] = $mediaInfo['mp3-192'];
    if (isset($mediaInfo['mp3-128'])) $formats[] = $mediaInfo['mp3-128'];
    if (isset($mediaInfo['mp3-64'])) $formats[] = $mediaInfo['mp3-64'];
    if (isset($mediaInfo['mp3-32'])) $formats[] = $mediaInfo['mp3-32'];

    return !empty($formats) ? $formats[0] : null;
}

// Construct audio URL
function constructAudioUrl($recitorId, $mediaInfo) {
    $bestFormat = getBestAudioFormat($mediaInfo);
    
    if ($bestFormat) {
        $fileExtension = ($bestFormat['type'] === 'ogg') ? 'ogg' : 'mp3';
        return "https://audio.globalquran.com/{$recitorId}/{$bestFormat['type']}/{$bestFormat['kbs']}kbs/1.{$fileExtension}";
    } else {
        // Fallback
        return "https://audio.globalquran.com/{$recitorId}/mp3/128kbs/1.mp3";
    }
}

// Example usage
try {
    echo "Fetching recitors from v2 API...\n\n";
    $data = fetchRecitors($apiKey);
    
    $recitors = displayRecitors($data);
    
    // Example: Get audio URL for first recitor
    if (!empty($recitors)) {
        $firstRecitor = $recitors[0];
        $recitorId = array_keys($data['list'])[0];
        
        echo "=== AUDIO URL EXAMPLE ===\n";
        echo "Recitor: " . ($firstRecitor['name'] ?? 'N/A') . "\n";
        echo "Available formats: " . implode(', ', array_keys($firstRecitor['media'] ?? [])) . "\n";
        
        $audioUrl = constructAudioUrl($recitorId, $firstRecitor['media'] ?? []);
        echo "Best audio URL: " . $audioUrl . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
