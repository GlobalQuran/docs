# Python Example: Quran by Juz
# This example shows how to fetch Quran content by Juz (Para) using the GlobalQuran API

import requests
import json
from typing import Dict, List, Optional

class QuranJuzFetcher:
    """A class to fetch Quran content by Juz (Para) numbers"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.globalquran.com"
    
    def fetch_juz(self, juz_number: int, quran_id: str = 'quran-simple') -> Optional[Dict]:
        """
        Fetch Quran content for a specific Juz
        
        Args:
            juz_number (int): Juz number (1-30)
            quran_id (str): Quran ID (default: 'quran-simple')
        
        Returns:
            Dict: API response data or None if error
        """
        url = f"{self.base_url}/v1/juz/{juz_number}/{quran_id}?key={self.api_key}"
        
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Request error: {e}")
            return None
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            return None
    
    def get_juz_statistics(self, data: Dict) -> Dict:
        """Get statistics about the Juz"""
        stats = {
            'total_surahs': 0,
            'total_verses': 0,
            'surahs': []
        }
        
        if data and 'quran' in data:
            for surah_num, surah in data['quran'].items():
                stats['total_surahs'] += 1
                stats['total_verses'] += len(surah)
                stats['surahs'].append({
                    'surah': int(surah_num),
                    'verses': len(surah)
                })
        
        return stats
    
    def display_juz_content(self, data: Dict, juz_number: int) -> None:
        """Display Juz content with statistics"""
        stats = self.get_juz_statistics(data)
        
        print(f"Juz {juz_number} Content")
        print("=" * 50)
        print(f"Total Surahs: {stats['total_surahs']}")
        print(f"Total Verses: {stats['total_verses']}")
        print("\nSurahs in this Juz:")
        
        for surah_info in stats['surahs']:
            print(f"  Surah {surah_info['surah']}: {surah_info['verses']} verses")
        
        print("\nFirst few verses:")
        print("-" * 30)
        
        verse_count = 0
        for surah in data['quran'].values():
            for verse in surah.values():
                if verse_count < 5:  # Show first 5 verses
                    print(f"{verse['surah']}:{verse['ayah']} {verse['verse']}")
                    verse_count += 1
                else:
                    break
            if verse_count >= 5:
                break

# Usage example
def main():
    # Initialize Juz fetcher
    fetcher = QuranJuzFetcher("REPLACE_WITH_YOUR_KEY")
    
    # Fetch Juz 1 (Al-Fatiha to Al-Baqarah)
    juz_data = fetcher.fetch_juz(1)
    
    if juz_data:
        fetcher.display_juz_content(juz_data, 1)
    else:
        print("Failed to fetch Juz data")

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
#     }
#   }
# }
