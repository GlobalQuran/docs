# Python Example: Quran List
# This example shows how to fetch the list of available Quran resources

import requests
import json

# API Endpoint
endpoint = 'https://api.globalquran.com/v1/quran?key=YOUR_API_KEY'

def fetch_quran_list():
    """
    Function to fetch Quran list
    
    Returns:
        dict: API response data or None if error
    """
    url = 'https://api.globalquran.com/v1/quran?key=YOUR_API_KEY'
    
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

def display_quran_list(data):
    """
    Function to display Quran list
    
    Args:
        data (dict): API response data
    """
    if not data or 'quranList' not in data:
        print("No Quran list found")
        return
    
    print("Available Quran Resources:")
    print("========================")
    
    for quran_id, quran_data in data['quranList'].items():
        if quran_data['format'] == 'text' and quran_data['type'] == 'quran':
            print(f"ID: {quran_id}")
            print(f"Name: {quran_data['english_name']}")
            print(f"Native Name: {quran_data['native_name']}")
            print(f"Language: {quran_data['language']}")
            print("---")

def display_translations(data):
    """
    Function to display translations
    
    Args:
        data (dict): API response data
    """
    if not data or 'quranList' not in data:
        print("No translations found")
        return
    
    print("\nAvailable Translations:")
    print("=====================")
    
    for quran_id, quran_data in data['quranList'].items():
        if quran_data['format'] == 'text' and quran_data['type'] == 'translation':
            print(f"ID: {quran_id}")
            print(f"Name: {quran_data['english_name']}")
            print(f"Native Name: {quran_data['native_name']}")
            print(f"Language: {quran_data['language']}")
            print("---")

def display_recitors(data):
    """
    Function to display recitors
    
    Args:
        data (dict): API response data
    """
    if not data or 'quranList' not in data:
        print("No recitors found")
        return
    
    print("\nAvailable Recitors:")
    print("==================")
    
    for quran_id, quran_data in data['quranList'].items():
        if quran_data['format'] == 'audio':
            print(f"ID: {quran_id}")
            print(f"Name: {quran_data['english_name']}")
            print(f"Native Name: {quran_data['native_name']}")
            print(f"Language: {quran_data['language']}")
            print("---")

# Usage example
if __name__ == "__main__":
    quran_list_data = fetch_quran_list()
    
    if quran_list_data:
        display_quran_list(quran_list_data)
        display_translations(quran_list_data)
        display_recitors(quran_list_data)
    else:
        print("Failed to fetch Quran list")

# Expected Response Structure:
# {
#   "quranList": {
#     "quran-simple": {
#       "name": "Quran Simple",
#       "english_name": "Quran Simple",
#       "native_name": "القرآن الكريم",
#       "language": "ar",
#       "format": "text",
#       "type": "quran"
#     },
#     "en.sahih": {
#       "name": "Sahih International",
#       "english_name": "Sahih International",
#       "native_name": "Sahih International",
#       "language": "en",
#       "format": "text",
#       "type": "translation"
#     },
#     "abdul_basit_murattal": {
#       "name": "Abdul Basit Murattal",
#       "english_name": "Abdul Basit Murattal",
#       "native_name": "عبد الباسط مرتل",
#       "language": "ar",
#       "format": "audio",
#       "type": "recitor"
#     }
#   }
# }
