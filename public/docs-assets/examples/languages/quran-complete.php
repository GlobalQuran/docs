<?php
/**
 * PHP Example: Complete Quran
 * This example shows how to fetch the complete Quran using the GlobalQuran API
 */

class CompleteQuranFetcher {
    private $apiKey;
    private $baseUrl = 'https://api.globalquran.com';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    /**
     * Fetch the complete Quran
     * 
     * @param string $quranId Quran ID (default: 'quran-simple')
     * @return array|null API response data or null if error
     */
    public function fetchCompleteQuran($quranId = 'quran-simple') {
        $url = $this->baseUrl . "/v1/quran/{$quranId}?key={$this->apiKey}";
        
        echo "Fetching complete Quran... This may take a moment.\n";
        
        $context = stream_context_create([
            'http' => [
                'timeout' => 60,
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
        
        echo "Quran data fetched successfully!\n";
        return $data;
    }
    
    /**
     * Get comprehensive statistics about the Quran
     * 
     * @param array $data API response data
     * @return array Quran statistics
     */
    public function getQuranStatistics($data) {
        $stats = [
            'totalSurahs' => 0,
            'totalVerses' => 0,
            'totalWords' => 0,
            'totalCharacters' => 0,
            'surahs' => [],
            'longestSurah' => ['surah' => 0, 'verses' => 0],
            'shortestSurah' => ['surah' => 0, 'verses' => PHP_INT_MAX],
            'longestVerse' => ['surah' => 0, 'ayah' => 0, 'length' => 0],
            'shortestVerse' => ['surah' => 0, 'ayah' => 0, 'length' => PHP_INT_MAX]
        ];
        
        if ($data && isset($data['quran'])) {
            foreach ($data['quran'] as $surahNum => $surah) {
                $surahNumber = (int)$surahNum;
                $surahVerses = count($surah);
                $surahWords = 0;
                $surahChars = 0;
                
                // Track longest/shortest surah
                if ($surahVerses > $stats['longestSurah']['verses']) {
                    $stats['longestSurah'] = ['surah' => $surahNumber, 'verses' => $surahVerses];
                }
                if ($surahVerses < $stats['shortestSurah']['verses']) {
                    $stats['shortestSurah'] = ['surah' => $surahNumber, 'verses' => $surahVerses];
                }
                
                foreach ($surah as $ayahNum => $verse) {
                    $words = str_word_count($verse['verse']);
                    $chars = mb_strlen($verse['verse']);
                    $surahWords += $words;
                    $surahChars += $chars;
                    
                    // Track longest/shortest verse
                    if ($chars > $stats['longestVerse']['length']) {
                        $stats['longestVerse'] = [
                            'surah' => $verse['surah'],
                            'ayah' => $verse['ayah'],
                            'length' => $chars
                        ];
                    }
                    if ($chars < $stats['shortestVerse']['length']) {
                        $stats['shortestVerse'] = [
                            'surah' => $verse['surah'],
                            'ayah' => $verse['ayah'],
                            'length' => $chars
                        ];
                    }
                }
                
                $stats['totalSurahs']++;
                $stats['totalVerses'] += $surahVerses;
                $stats['totalWords'] += $surahWords;
                $stats['totalCharacters'] += $surahChars;
                
                $stats['surahs'][] = [
                    'surah' => $surahNumber,
                    'verses' => $surahVerses,
                    'words' => $surahWords,
                    'characters' => $surahChars,
                    'averageWordsPerVerse' => round($surahWords / $surahVerses)
                ];
            }
        }
        
        return $stats;
    }
    
    /**
     * Display comprehensive Quran overview
     * 
     * @param array $data API response data
     */
    public function displayQuranOverview($data) {
        $stats = $this->getQuranStatistics($data);
        
        echo "Complete Quran Overview\n";
        echo str_repeat('=', 50) . "\n";
        echo "Total Surahs: {$stats['totalSurahs']}\n";
        echo "Total Verses: {$stats['totalVerses']}\n";
        echo "Total Words: " . number_format($stats['totalWords']) . "\n";
        echo "Total Characters: " . number_format($stats['totalCharacters']) . "\n";
        echo "Average Words per Verse: " . round($stats['totalWords'] / $stats['totalVerses']) . "\n";
        echo "Average Characters per Verse: " . round($stats['totalCharacters'] / $stats['totalVerses']) . "\n";
        
        echo "\nSurah Analysis:\n";
        echo "Longest Surah: {$stats['longestSurah']['surah']} ({$stats['longestSurah']['verses']} verses)\n";
        echo "Shortest Surah: {$stats['shortestSurah']['surah']} ({$stats['shortestSurah']['verses']} verses)\n";
        
        echo "\nVerse Analysis:\n";
        echo "Longest verse: {$stats['longestVerse']['surah']}:{$stats['longestVerse']['ayah']} ({$stats['longestVerse']['length']} characters)\n";
        echo "Shortest verse: {$stats['shortestVerse']['surah']}:{$stats['shortestVerse']['ayah']} ({$stats['shortestVerse']['length']} characters)\n";
        
        echo "\nFirst 10 Surahs:\n";
        echo str_repeat('-', 30) . "\n";
        foreach (array_slice($stats['surahs'], 0, 10) as $surah) {
            echo "Surah {$surah['surah']}: {$surah['verses']} verses, {$surah['words']} words\n";
        }
    }
    
    /**
     * Search for verses containing a specific term
     * 
     * @param array $data API response data
     * @param string $searchTerm Term to search for
     * @return array Array of matching verses
     */
    public function searchVerses($data, $searchTerm) {
        $results = [];
        $searchTermLower = mb_strtolower($searchTerm);
        
        if ($data && isset($data['quran'])) {
            foreach ($data['quran'] as $surah) {
                foreach ($surah as $verse) {
                    if (mb_strpos(mb_strtolower($verse['verse']), $searchTermLower) !== false) {
                        $results[] = $verse;
                    }
                }
            }
        }
        
        return $results;
    }
    
    /**
     * Get verses by surah
     * 
     * @param array $data API response data
     * @param int $surahNumber Surah number
     * @return array Array of verses for the surah
     */
    public function getSurahVerses($data, $surahNumber) {
        if (!$data || !isset($data['quran'][$surahNumber])) {
            return [];
        }
        
        $verses = [];
        foreach ($data['quran'][$surahNumber] as $verse) {
            $verses[] = $verse;
        }
        
        return $verses;
    }
    
    /**
     * Save Quran data to a JSON file
     * 
     * @param array $data API response data
     * @param string $filename Output filename
     */
    public function saveToFile($data, $filename = 'quran-data.json') {
        $jsonData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        if (file_put_contents($filename, $jsonData) !== false) {
            echo "Quran data saved to {$filename}\n";
        } else {
            echo "Error: Failed to save file\n";
        }
    }
    
    /**
     * Get random verse from Quran
     * 
     * @param array $data API response data
     * @return array|null Random verse or null
     */
    public function getRandomVerse($data) {
        if (!$data || !isset($data['quran'])) {
            return null;
        }
        
        $allVerses = [];
        foreach ($data['quran'] as $surah) {
            foreach ($surah as $verse) {
                $allVerses[] = $verse;
            }
        }
        
        if (empty($allVerses)) {
            return null;
        }
        
        return $allVerses[array_rand($allVerses)];
    }
}

// Usage example
function main() {
    // Initialize Quran fetcher
    $fetcher = new CompleteQuranFetcher('YOUR_API_KEY');
    
    // Fetch complete Quran
    $quranData = $fetcher->fetchCompleteQuran();
    
    if ($quranData) {
        $fetcher->displayQuranOverview($quranData);
        
        // Example search
        echo "\nSearching for verses containing 'رحمة' (mercy):\n";
        $mercyVerses = $fetcher->searchVerses($quranData, 'رحمة');
        echo "Found " . count($mercyVerses) . " verses containing 'رحمة'\n";
        
        if (!empty($mercyVerses)) {
            echo "First few results:\n";
            foreach (array_slice($mercyVerses, 0, 3) as $verse) {
                echo "{$verse['surah']}:{$verse['ayah']} {$verse['verse']}\n";
            }
        }
        
        // Get random verse
        $randomVerse = $fetcher->getRandomVerse($quranData);
        if ($randomVerse) {
            echo "\nRandom verse:\n";
            echo "{$randomVerse['surah']}:{$randomVerse['ayah']} {$randomVerse['verse']}\n";
        }
        
        // Save to file (optional)
        // $fetcher->saveToFile($quranData, 'complete-quran.json');
    } else {
        echo "Failed to fetch Quran data\n";
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
 *     "1": {
 *       "1": { "surah": 1, "ayah": 1, "verse": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
 *       "2": { "surah": 1, "ayah": 2, "verse": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
 *       ...
 *     },
 *     "2": {
 *       "1": { "surah": 2, "ayah": 1, "verse": "الم" },
 *       "2": { "surah": 2, "ayah": 2, "verse": "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ" },
 *       ...
 *     },
 *     ...
 *     "114": {
 *       "1": { "surah": 114, "ayah": 1, "verse": "قُلْ أَعُوذُ بِرَبِّ النَّاسِ" },
 *       "2": { "surah": 114, "ayah": 2, "verse": "مَلِكِ النَّاسِ" },
 *       "3": { "surah": 114, "ayah": 3, "verse": "إِلَٰهِ النَّاسِ" },
 *       "4": { "surah": 114, "ayah": 4, "verse": "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ" },
 *       "5": { "surah": 114, "ayah": 5, "verse": "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ" },
 *       "6": { "surah": 114, "ayah": 6, "verse": "مِنَ الْجِنَّةِ وَالنَّاسِ" }
 *     }
 *   }
 * }
 */
?>
