# Python Example: Quran by Page
# This example shows how to fetch Quran content by page using the GlobalQuran API

import requests
import json
from typing import Dict, List, Optional

class QuranPageFetcher:
    """A class to fetch Quran content by page numbers"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.globalquran.com"
    
    def fetch_page(self, page_number: int, quran_id: str = 'quran-simple') -> Optional[Dict]:
        """
        Fetch Quran content for a specific page
        
        Args:
            page_number (int): Page number (1-604)
            quran_id (str): Quran ID (default: 'quran-simple')
        
        Returns:
            Dict: API response data or None if error
        """
        url = f"{self.base_url}/v1/page/{page_number}/{quran_id}?key={self.api_key}"
        
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
    
    def get_verses_from_page(self, data: Dict) -> List[Dict]:
        """Extract verses from page data"""
        verses = []
        if data and 'quran' in data:
            for surah in data['quran'].values():
                for verse in surah.values():
                    verses.append({
                        'surah': verse['surah'],
                        'ayah': verse['ayah'],
                        'verse': verse['verse']
                    })
        return verses
    
    def display_page_content(self, data: Dict, page_number: int) -> None:
        """Display page content in a formatted way"""
        verses = self.get_verses_from_page(data)
        
        if not verses:
            print(f"No content found for page {page_number}")
            return
        
        print(f"Quran Page {page_number}")
        print("=" * 50)
        
        for verse in verses:
            print(f"{verse['surah']}:{verse['ayah']} {verse['verse']}")
        
        print(f"\nTotal verses on page {page_number}: {len(verses)}")

# Usage example
def main():
    # Initialize page fetcher
    fetcher = QuranPageFetcher("REPLACE_WITH_YOUR_KEY")
    
    # Fetch page 1 (Al-Fatiha)
    page_data = fetcher.fetch_page(1)
    
    if page_data:
        fetcher.display_page_content(page_data, 1)
    else:
        print("Failed to fetch page data")

if __name__ == "__main__":
    main()

# Expected Response Structure:
# {
#   "quran": {
#     "1": {
#       "1": { "surah": 1, "ayah": 1, "verse": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
#       "2": { "surah": 1, "ayah": 2, "verse": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" },
#       "3": { "surah": 1, "ayah": 3, "verse": "الرَّحْمَٰنِ الرَّحِيمِ" },
#       "4": { "surah": 1, "ayah": 4, "verse": "مَالِكِ يَوْمِ الدِّينِ" },
#       "5": { "surah": 1, "ayah": 5, "verse": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ" },
#       "6": { "surah": 1, "ayah": 6, "verse": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" },
#       "7": { "surah": 1, "ayah": 7, "verse": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ" }
#     }
#   }
# }
