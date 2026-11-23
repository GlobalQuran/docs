<?php
/**
 * PHP Example: Quran by Juz
 * This example shows how to fetch Quran content by Juz (Para) using the GlobalQuran API
 */

class QuranJuzFetcher {
    private $apiKey;
    private $baseUrl = 'https://api.globalquran.com';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    /**
     * Fetch Quran content for a specific Juz
     * 
     * @param int $juzNumber Juz number (1-30)
     * @param string $quranId Quran ID (default: 'quran-simple')
     * @return array|null API response data or null if error
     */
    public function fetchJuz($juzNumber, $quranId = 'quran-simple') {
        $url = $this->baseUrl . "/v1/juz/{$juzNumber}/{$quranId}?key={$this->apiKey}";
        
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
     * Get comprehensive statistics about the Juz
     * 
     * @param array $data API response data
     * @return array Juz statistics
     */
    public function getJuzStatistics($data) {
        $stats = [
            'totalSurahs' => 0,
            'totalVerses' => 0,
            'totalWords' => 0,
            'totalCharacters' => 0,
            'surahs' => [],
            'verseDistribution' => []
        ];
        
        if ($data && isset($data['quran'])) {
            foreach ($data['quran'] as $surahNum => $surah) {
                $surahNumber = (int)$surahNum;
                $surahVerses = count($surah);
                $surahWords = 0;
                $surahChars = 0;
                
                foreach ($surah as $verse) {
                    $words = str_word_count($verse['verse']);
                    $chars = mb_strlen($verse['verse']);
                    $surahWords += $words;
                    $surahChars += $chars;
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
                
                $stats['verseDistribution'][$surahNum] = $surahVerses;
            }
        }
        
        return $stats;
    }
    
    /**
     * Display Juz content with comprehensive statistics
     * 
     * @param array $data API response data
     * @param int $juzNumber Juz number
     */
    public function displayJuzContent($data, $juzNumber) {
        $stats = $this->getJuzStatistics($data);
        
        echo "Juz {$juzNumber} Content Analysis\n";
        echo str_repeat('=', 50) . "\n";
        echo "Total Surahs: {$stats['totalSurahs']}\n";
        echo "Total Verses: {$stats['totalVerses']}\n";
        echo "Total Words: " . number_format($stats['totalWords']) . "\n";
        echo "Total Characters: " . number_format($stats['totalCharacters']) . "\n";
        echo "Average Words per Verse: " . round($stats['totalWords'] / $stats['totalVerses']) . "\n";
        echo "Average Characters per Verse: " . round($stats['totalCharacters'] / $stats['totalVerses']) . "\n";
        
        echo "\nSurah Breakdown:\n";
        echo str_repeat('-', 30) . "\n";
        foreach ($stats['surahs'] as $surah) {
            echo "Surah {$surah['surah']}: {$surah['verses']} verses, {$surah['words']} words, {$surah['characters']} chars\n";
        }
        
        echo "\nFirst few verses:\n";
        echo str_repeat('-', 30) . "\n";
        $verseCount = 0;
        foreach ($data['quran'] as $surah) {
            foreach ($surah as $verse) {
                if ($verseCount < 5) {
                    echo "{$verse['surah']}:{$verse['ayah']} {$verse['verse']}\n";
                    $verseCount++;
                } else {
                    break 2;
                }
            }
        }
    }
    
    /**
     * Find longest and shortest verses in Juz
     * 
     * @param array $data API response data
     * @return array Longest and shortest verses
     */
    public function findLongestShortestVerses($data) {
        $longestVerse = ['length' => 0, 'verse' => null];
        $shortestVerse = ['length' => PHP_INT_MAX, 'verse' => null];
        
        if ($data && isset($data['quran'])) {
            foreach ($data['quran'] as $surah) {
                foreach ($surah as $verse) {
                    $length = mb_strlen($verse['verse']);
                    
                    if ($length > $longestVerse['length']) {
                        $longestVerse = ['length' => $length, 'verse' => $verse];
                    }
                    
                    if ($length < $shortestVerse['length']) {
                        $shortestVerse = ['length' => $length, 'verse' => $verse];
                    }
                }
            }
        }
        
        return ['longestVerse' => $longestVerse, 'shortestVerse' => $shortestVerse];
    }
    
    /**
     * Get verses by surah from Juz data
     * 
     * @param array $data API response data
     * @return array Verses grouped by surah
     */
    public function getVersesBySurah($data) {
        $versesBySurah = [];
        
        if ($data && isset($data['quran'])) {
            foreach ($data['quran'] as $surahNum => $surah) {
                $versesBySurah[$surahNum] = [];
                foreach ($surah as $verse) {
                    $versesBySurah[$surahNum][] = $verse;
                }
            }
        }
        
        return $versesBySurah;
    }
    
    /**
     * Search for verses containing a specific term in Juz
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
}

// Usage example
function main() {
    // Initialize Juz fetcher
    $fetcher = new QuranJuzFetcher('REPLACE_WITH_YOUR_KEY');
    
    // Fetch Juz 1 (Al-Fatiha to Al-Baqarah)
    echo "Fetching Juz 1...\n";
    $juzData = $fetcher->fetchJuz(1);
    
    if ($juzData) {
        $fetcher->displayJuzContent($juzData, 1);
        
        // Find longest and shortest verses
        $verseAnalysis = $fetcher->findLongestShortestVerses($juzData);
        echo "\nVerse Analysis:\n";
        echo "Longest verse ({$verseAnalysis['longestVerse']['length']} chars): ";
        echo "{$verseAnalysis['longestVerse']['verse']['surah']}:{$verseAnalysis['longestVerse']['verse']['ayah']}\n";
        echo "Shortest verse ({$verseAnalysis['shortestVerse']['length']} chars): ";
        echo "{$verseAnalysis['shortestVerse']['verse']['surah']}:{$verseAnalysis['shortestVerse']['verse']['ayah']}\n";
        
        // Search for verses containing 'رحمة' (mercy)
        echo "\nSearching for verses containing 'رحمة' (mercy):\n";
        $mercyVerses = $fetcher->searchVerses($juzData, 'رحمة');
        echo "Found " . count($mercyVerses) . " verses containing 'رحمة'\n";
        
        if (!empty($mercyVerses)) {
            echo "First few results:\n";
            foreach (array_slice($mercyVerses, 0, 3) as $verse) {
                echo "{$verse['surah']}:{$verse['ayah']} {$verse['verse']}\n";
            }
        }
    } else {
        echo "Failed to fetch Juz data\n";
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
 *     }
 *   }
 * }
 */
?>
