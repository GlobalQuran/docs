# Python Example: Quran by Ayah
# This example shows how to fetch a specific Ayah using the GlobalQuran API

import requests
import json
from typing import Dict, Optional

class GlobalQuranAPI:
    """A simple wrapper class for GlobalQuran API calls"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.globalquran.com"
    
    def fetch_ayah(self, ayah_reference: str, quran_id: str = 'quran-simple') -> Optional[Dict]:
        """
        Fetch a specific Ayah from the Quran
        
        Args:
            ayah_reference (str): Ayah reference in format 'surah:ayah' (e.g., '2:255')
            quran_id (str): Quran ID (default: 'quran-simple')
        
        Returns:
            Dict: API response data or None if error
        """
        url = f"{self.base_url}/v1/ayah/{ayah_reference}/{quran_id}?key={self.api_key}"
        
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
    
    def display_ayah(self, data: Dict) -> None:
        """Display Ayah data in a formatted way"""
        if not data or 'quran' not in data:
            print("No Quran data found")
            return
        
        print("=" * 50)
        for surah in data['quran'].values():
            for verse in surah.values():
                print(f"Surah {verse['surah']}, Ayah {verse['ayah']}")
                print(f"Arabic: {verse['verse']}")
                print("-" * 30)

# Usage example
def main():
    # Initialize API client
    api = GlobalQuranAPI("REPLACE_WITH_YOUR_KEY")
    
    # Fetch Ayat al-Kursi (2:255)
    ayah_data = api.fetch_ayah("2:255")
    
    if ayah_data:
        api.display_ayah(ayah_data)
    else:
        print("Failed to fetch Ayah data")

if __name__ == "__main__":
    main()

# Expected Response Structure:
# {
#   "quran": {
#     "2": {
#       "255": {
#         "surah": 2,
#         "ayah": 255,
#         "verse": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ"
#       }
#     }
#   }
# }
