<?php
/**
 * PHP Example: Quran by Page
 * This example shows how to fetch Quran content by page using the GlobalQuran API
 */

class QuranPageFetcher {
    private $apiKey;
    private $baseUrl = 'https://api.globalquran.com';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    /**
     * Fetch Quran content for a specific page
     * 
     * @param int $pageNumber Page number (1-604)
     * @param string $quranId Quran ID (default: 'quran-simple')
     * @return array|null API response data or null if error
     */
    public function fetchPage($pageNumber, $quranId = 'quran-simple') {
        $url = $this->baseUrl . "/v1/page/{$pageNumber}/{$quranId}?key={$this->apiKey}";
        
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
     * Extract verses from page data
     * 
     * @param array $data API response data
     * @return array Array of verse objects
     */
    public function getVersesFromPage($data) {
        $verses = [];
        
        if ($data && isset($data['quran'])) {
            foreach ($data['quran'] as $surah) {
                foreach ($surah as $verse) {
                    $verses[] = [
                        'surah' => $verse['surah'],
                        'ayah' => $verse['ayah'],
                        'verse' => $verse['verse']
                    ];
                }
            }
        }
        
        return $verses;
    }
    
    /**
     * Display page content in a formatted way
     * 
     * @param array $data API response data
     * @param int $pageNumber Page number
     */
    public function displayPageContent($data, $pageNumber) {
        $verses = $this->getVersesFromPage($data);
        
        if (empty($verses)) {
            echo "No content found for page {$pageNumber}\n";
            return;
        }
        
        echo "Quran Page {$pageNumber}\n";
        echo str_repeat('=', 50) . "\n";
        
        foreach ($verses as $verse) {
            echo "{$verse['surah']}:{$verse['ayah']} {$verse['verse']}\n";
        }
        
        echo "\nTotal verses on page {$pageNumber}: " . count($verses) . "\n";
    }
    
    /**
     * Get page statistics
     * 
     * @param array $data API response data
     * @return array Page statistics
     */
    public function getPageStats($data) {
        $verses = $this->getVersesFromPage($data);
        $surahs = [];
        $totalWords = 0;
        $totalChars = 0;
        
        foreach ($verses as $verse) {
            $surahs[$verse['surah']] = true;
            $totalWords += str_word_count($verse['verse']);
            $totalChars += mb_strlen($verse['verse']);
        }
        
        return [
            'totalVerses' => count($verses),
            'totalSurahs' => count($surahs),
            'totalWords' => $totalWords,
            'totalChars' => $totalChars,
            'averageWordsPerVerse' => count($verses) > 0 ? round($totalWords / count($verses)) : 0,
            'averageCharsPerVerse' => count($verses) > 0 ? round($totalChars / count($verses)) : 0
        ];
    }
    
    /**
     * Get verses by surah from page data
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
     * Find longest and shortest verses on page
     * 
     * @param array $data API response data
     * @return array Longest and shortest verses
     */
    public function findLongestShortestVerses($data) {
        $verses = $this->getVersesFromPage($data);
        $longestVerse = ['length' => 0, 'verse' => null];
        $shortestVerse = ['length' => PHP_INT_MAX, 'verse' => null];
        
        foreach ($verses as $verse) {
            $length = mb_strlen($verse['verse']);
            
            if ($length > $longestVerse['length']) {
                $longestVerse = ['length' => $length, 'verse' => $verse];
            }
            
            if ($length < $shortestVerse['length']) {
                $shortestVerse = ['length' => $length, 'verse' => $verse];
            }
        }
        
        return ['longestVerse' => $longestVerse, 'shortestVerse' => $shortestVerse];
    }
}

// Usage example
function main() {
    // Initialize page fetcher
    $fetcher = new QuranPageFetcher('REPLACE_WITH_YOUR_KEY');
    
    // Fetch page 1 (Al-Fatiha)
    echo "Fetching page 1...\n";
    $pageData = $fetcher->fetchPage(1);
    
    if ($pageData) {
        $fetcher->displayPageContent($pageData, 1);
        
        // Get statistics
        $stats = $fetcher->getPageStats($pageData);
        echo "\nPage Statistics:\n";
        echo "Total Verses: {$stats['totalVerses']}\n";
        echo "Total Surahs: {$stats['totalSurahs']}\n";
        echo "Total Words: {$stats['totalWords']}\n";
        echo "Total Characters: {$stats['totalChars']}\n";
        echo "Average Words per Verse: {$stats['averageWordsPerVerse']}\n";
        echo "Average Characters per Verse: {$stats['averageCharsPerVerse']}\n";
        
        // Get verses by surah
        $versesBySurah = $fetcher->getVersesBySurah($pageData);
        echo "\nVerses by Surah:\n";
        foreach ($versesBySurah as $surahNum => $verses) {
            echo "Surah {$surahNum}: " . count($verses) . " verses\n";
        }
        
        // Find longest and shortest verses
        $verseAnalysis = $fetcher->findLongestShortestVerses($pageData);
        echo "\nVerse Analysis:\n";
        echo "Longest verse ({$verseAnalysis['longestVerse']['length']} chars): ";
        echo "{$verseAnalysis['longestVerse']['verse']['surah']}:{$verseAnalysis['longestVerse']['verse']['ayah']}\n";
        echo "Shortest verse ({$verseAnalysis['shortestVerse']['length']} chars): ";
        echo "{$verseAnalysis['shortestVerse']['verse']['surah']}:{$verseAnalysis['shortestVerse']['verse']['ayah']}\n";
    } else {
        echo "Failed to fetch page data\n";
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
 *       "3": { "surah": 1, "ayah": 3, "verse": "الرَّحْمَٰنِ الرَّحِيمِ" },
 *       "4": { "surah": 1, "ayah": 4, "verse": "مَالِكِ يَوْمِ الدِّينِ" },
 *       "5": { "surah": 1, "ayah": 5, "verse": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
 *       "6": { "surah": 1, "ayah": 6, "verse": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" },
 *       "7": { "surah": 1, "ayah": 7, "verse": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ" }
 *     }
 *   }
 * }
 */
?>
