# Python Example: Quran by Surah
# This example shows how to fetch a specific Surah using the GlobalQuran API

import requests
import json

# API Endpoint
endpoint = 'https://api.globalquran.com/v1/surah/1/quran-simple?key=YOUR_API_KEY'

def fetch_surah(surah_number=1, quran_id='quran-simple'):
    """
    Function to fetch Surah data
    
    Args:
        surah_number (int): Surah number (1-114)
        quran_id (str): Quran ID (default: 'quran-simple')
    
    Returns:
        dict: API response data or None if error
    """
    url = f"https://api.globalquran.com/v1/surah/{surah_number}/{quran_id}?key=YOUR_API_KEY"
    
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        
        data = response.json()
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        return None

def display_surah(data):
    """
    Function to display Surah verses
    
    Args:
        data (dict): API response data
    """
    if not data or 'quran' not in data:
        print("No Quran data found")
        return
    
    # Process the response data
    for surah in data['quran'].values():
        for verse in surah.values():
            print(f"{verse['surah']}:{verse['ayah']} {verse['verse']}")

# Usage example
if __name__ == "__main__":
    surah_data = fetch_surah(1)  # Al-Fatiha
    
    if surah_data:
        display_surah(surah_data)
    else:
        print("Failed to fetch Surah data")

# Expected Response Structure:
# {
#   "quran": {
#     "1": {
#       "1": {
#         "surah": 1,
#         "ayah": 1,
#         "verse": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
#       },
#       "2": {
#         "surah": 1,
#         "ayah": 2,
#         "verse": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
#       },
#       "3": {
#         "surah": 1,
#         "ayah": 3,
#         "verse": "الرَّحْمَٰنِ الرَّحِيمِ"
#       },
#       "4": {
#         "surah": 1,
#         "ayah": 4,
#         "verse": "مَالِكِ يَوْمِ الدِّينِ"
#       },
#       "5": {
#         "surah": 1,
#         "ayah": 5,
#         "verse": "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"
#       },
#       "6": {
#         "surah": 1,
#         "ayah": 6,
#         "verse": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ"
#       },
#       "7": {
#         "surah": 1,
#         "ayah": 7,
#         "verse": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"
#       }
#     }
#   }
# }
