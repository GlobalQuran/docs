# Python Example: All-in-One Request
# This example shows how to fetch multiple data types in a single request using the GlobalQuran API

import requests
import json

# API Endpoint
endpoint = 'https://api.globalquran.com/v1/all/surah/1/quran-simple/en?key=YOUR_API_KEY'

def fetch_all_data(data_in='surah', data_in_no=1, quran_id='quran-simple', lang_code='en'):
    """
    Function to fetch multiple data types in a single request
    
    Args:
        data_in (str): Type of data to fetch (surah, ayah, page, juz)
        data_in_no (int): Number for the data type
        quran_id (str): Quran ID (default: 'quran-simple')
        lang_code (str): Language code (default: 'en')
    
    Returns:
        dict: API response data or None if error
    """
    try:
        url = f"https://api.globalquran.com/v1/all/{data_in}/{data_in_no}/{quran_id}/{lang_code}?key=YOUR_API_KEY"
        response = requests.get(url)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        
        data = response.json()
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching all data: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None

def display_all_data(data):
    """
    Display all data in a formatted way
    
    Args:
        data (dict): API response data
    """
    if not data:
        print("No data available")
        return
    
    print("All-in-One API Response:")
    print("=" * 50)
    
    # Display Quran data
    if 'quran' in data:
        print("Quran Data:")
        quran_data = data['quran']
        for surah_key, surah_data in quran_data.items():
            print(f"  Surah {surah_key}: {len(surah_data)} ayahs")
            # Show first few ayahs
            for ayah_key, ayah_data in list(surah_data.items())[:3]:
                print(f"    Ayah {ayah_key}: {ayah_data.get('verse', 'N/A')[:50]}...")
        print()
    
    # Display translation data
    if 'translation' in data:
        print("Translation Data:")
        translation_data = data['translation']
        for surah_key, surah_data in translation_data.items():
            print(f"  Surah {surah_key}: {len(surah_data)} translations")
            # Show first few translations
            for ayah_key, ayah_data in list(surah_data.items())[:3]:
                print(f"    Ayah {ayah_key}: {ayah_data.get('text', 'N/A')[:50]}...")
        print()
    
    # Display recitor data
    if 'recitor' in data:
        print("Recitor Data:")
        recitor_data = data['recitor']
        for surah_key, surah_data in recitor_data.items():
            print(f"  Surah {surah_key}: {len(surah_data)} recitations")
        print()

# Main execution
if __name__ == "__main__":
    print("Fetching all-in-one data for Surah 1...")
    data = fetch_all_data('surah', 1, 'quran-simple', 'en')
    
    if data:
        display_all_data(data)
        
        print("Example usage for different data types:")
        print("Surah: https://api.globalquran.com/v1/all/surah/1/quran-simple/en?key=YOUR_API_KEY")
        print("Ayah: https://api.globalquran.com/v1/all/ayah/2:255/quran-simple/en?key=YOUR_API_KEY")
        print("Page: https://api.globalquran.com/v1/all/page/1/quran-simple/en?key=YOUR_API_KEY")
        print("Juz: https://api.globalquran.com/v1/all/juz/1/quran-simple/en?key=YOUR_API_KEY")
    else:
        print("Failed to fetch all-in-one data")

# Expected Response Structure:
# {
#   "quran": {
#     "1": {
#       "1": { "surah": 1, "ayah": 1, "verse": "..." },
#       "2": { "surah": 1, "ayah": 2, "verse": "..." }
#     }
#   },
#   "translation": {
#     "1": {
#       "1": { "surah": 1, "ayah": 1, "text": "..." },
#       "2": { "surah": 1, "ayah": 2, "text": "..." }
#     }
#   },
#   "recitor": {
#     "1": {
#       "1": { "surah": 1, "ayah": 1, "audio": "..." },
#       "2": { "surah": 1, "ayah": 2, "audio": "..." }
#     }
#   }
# }
