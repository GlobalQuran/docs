# Python Example: Translation List
# This example shows how to fetch available translations using the GlobalQuran API

import requests
import json

# API Endpoint
endpoint = 'https://api.globalquran.com/v1/list/translation?key=YOUR_API_KEY'

def fetch_translations():
    """
    Function to fetch available translations
    
    Returns:
        dict: API response data or None if error
    """
    try:
        response = requests.get(endpoint)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        
        data = response.json()
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching translations: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None

def display_translations(data):
    """
    Display translations in a formatted way
    
    Args:
        data (dict): API response data
    """
    if not data or 'translation' not in data:
        print("No translation data available")
        return
    
    translations = data['translation']
    print(f"Found {len(translations)} translations:")
    print("-" * 50)
    
    for translation_id, translation_info in translations.items():
        print(f"ID: {translation_id}")
        print(f"Name: {translation_info.get('name', 'N/A')}")
        print(f"Language: {translation_info.get('language', 'N/A')}")
        print(f"Author: {translation_info.get('author', 'N/A')}")
        print("-" * 30)

# Main execution
if __name__ == "__main__":
    print("Fetching available translations...")
    data = fetch_translations()
    
    if data:
        display_translations(data)
        
        # Example of using a specific translation
        if 'translation' in data:
            first_translation = list(data['translation'].keys())[0]
            print(f"\nExample usage with translation ID '{first_translation}':")
            print(f"https://api.globalquran.com/v1/surah/1/{first_translation}?key=YOUR_API_KEY")
    else:
        print("Failed to fetch translations")

# Expected Response Structure:
# {
#   "translation": {
#     "en.sahih": {
#       "name": "Sahih International",
#       "language": "English",
#       "author": "Sahih International"
#     },
#     "en.pickthall": {
#       "name": "Pickthall",
#       "language": "English", 
#       "author": "Mohammed Marmaduke William Pickthall"
#     }
#   }
# }
