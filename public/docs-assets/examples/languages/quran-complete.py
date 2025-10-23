# Python Example: Complete Quran
# This example shows how to fetch the complete Quran using the GlobalQuran API

import requests
import json
from typing import Dict, List, Optional
import time

class CompleteQuranFetcher:
    """A class to fetch the complete Quran"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.globalquran.com"
    
    def fetch_complete_quran(self, quran_id: str = 'quran-simple') -> Optional[Dict]:
        """
        Fetch the complete Quran
        
        Args:
            quran_id (str): Quran ID (default: 'quran-simple')
        
        Returns:
            Dict: API response data or None if error
        """
        url = f"{self.base_url}/v1/quran/{quran_id}?key={self.api_key}"
        
        try:
            print("Fetching complete Quran... This may take a moment.")
            response = requests.get(url, timeout=60)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Request error: {e}")
            return None
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return None
    
    def get_quran_statistics(self, data: Dict) -> Dict:
        """Get comprehensive statistics about the Quran"""
        stats = {
            'total_surahs': 0,
            'total_verses': 0,
            'total_words': 0,
            'total_characters': 0,
            'surahs': []
        }
        
        if data and 'quran' in data:
            for surah_num, surah in data['quran'].items():
                surah_verses = len(surah)
                surah_words = 0
                surah_chars = 0
                
                for verse in surah.values():
                    words = len(verse['verse'].split())
                    chars = len(verse['verse'])
                    surah_words += words
                    surah_chars += chars
                
                stats['total_surahs'] += 1
                stats['total_verses'] += surah_verses
                stats['total_words'] += surah_words
                stats['total_characters'] += surah_chars
                
                stats['surahs'].append({
                    'surah': int(surah_num),
                    'verses': surah_verses,
                    'words': surah_words,
                    'characters': surah_chars
                })
        
        return stats
    
    def display_quran_overview(self, data: Dict) -> None:
        """Display comprehensive Quran overview"""
        stats = self.get_quran_statistics(data)
        
        print("Complete Quran Overview")
        print("=" * 50)
        print(f"Total Surahs: {stats['total_surahs']}")
        print(f"Total Verses: {stats['total_verses']}")
        print(f"Total Words: {stats['total_words']:,}")
        print(f"Total Characters: {stats['total_characters']:,}")
        
        print("\nSurah Breakdown:")
        print("-" * 30)
        for surah_info in stats['surahs'][:10]:  # Show first 10 surahs
            print(f"Surah {surah_info['surah']}: {surah_info['verses']} verses, "
                  f"{surah_info['words']} words, {surah_info['characters']} characters")
        
        if len(stats['surahs']) > 10:
            print(f"... and {len(stats['surahs']) - 10} more surahs")
    
    def search_verses(self, data: Dict, search_term: str) -> List[Dict]:
        """Search for verses containing a specific term"""
        results = []
        search_term_lower = search_term.lower()
        
        if data and 'quran' in data:
            for surah in data['quran'].values():
                for verse in surah.values():
                    if search_term_lower in verse['verse'].lower():
                        results.append(verse)
        
        return results

# Usage example
def main():
    # Initialize Quran fetcher
    fetcher = CompleteQuranFetcher("YOUR_API_KEY")
    
    # Fetch complete Quran
    quran_data = fetcher.fetch_complete_quran()
    
    if quran_data:
        fetcher.display_quran_overview(quran_data)
        
        # Example search
        print("\nSearching for verses containing 'رحمة' (mercy):")
        mercy_verses = fetcher.search_verses(quran_data, "رحمة")
        print(f"Found {len(mercy_verses)} verses containing 'رحمة'")
        
        if mercy_verses:
            print("First few results:")
            for verse in mercy_verses[:3]:
                print(f"{verse['surah']}:{verse['ayah']} {verse['verse']}")
    else:
        print("Failed to fetch Quran data")

if __name__ == "__main__":
    main()

# Expected Response Structure:
# {
#   "quran": {
#     "1": {
#       "1": { "surah": 1, "ayah": 1, "verse": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
#       "2": { "surah": 1, "ayah": 2, "verse": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
#       ...
#     },
#     "2": {
#       "1": { "surah": 2, "ayah": 1, "verse": "الم" },
#       "2": { "surah": 2, "ayah": 2, "verse": "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ" },
#       ...
#     },
#     ...
#     "114": {
#       "1": { "surah": 114, "ayah": 1, "verse": "قُلْ أَعُوذُ بِرَبِّ النَّاسِ" },
#       "2": { "surah": 114, "ayah": 2, "verse": "مَلِكِ النَّاسِ" },
#       "3": { "surah": 114, "ayah": 3, "verse": "إِلَٰهِ النَّاسِ" },
#       "4": { "surah": 114, "ayah": 4, "verse": "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ" },
#       "5": { "surah": 114, "ayah": 5, "verse": "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ" },
#       "6": { "surah": 114, "ayah": 6, "verse": "مِنَ الْجِنَّةِ وَالنَّاسِ" }
#     }
#   }
# }
