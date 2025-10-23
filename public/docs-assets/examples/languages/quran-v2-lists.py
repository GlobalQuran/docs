# Python Example: v2 API Lists
# This example shows how to use the new v2 API endpoints for fetching lists

import requests
import json

# API Endpoints
translation_endpoint = 'https://api.globalquran.com/v2/list/translation?key=YOUR_API_KEY'
recitor_endpoint = 'https://api.globalquran.com/v2/list/recitor?key=YOUR_API_KEY'
quran_endpoint = 'https://api.globalquran.com/v2/list/quran?key=YOUR_API_KEY'

def fetch_v2_list(list_type='translation'):
    """
    Function to fetch v2 API lists
    
    Args:
        list_type (str): Type of list to fetch (translation, recitor, quran)
    
    Returns:
        dict: API response data or None if error
    """
    try:
        url = f"https://api.globalquran.com/v2/list/{list_type}?key=YOUR_API_KEY"
        response = requests.get(url)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        
        data = response.json()
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {list_type} list: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None

def display_v2_list(data, list_type):
    """
    Display v2 API list in a formatted way
    
    Args:
        data (dict): API response data
        list_type (str): Type of list being displayed
    """
    if not data or list_type not in data:
        print(f"No {list_type} data available")
        return
    
    items = data[list_type]
    print(f"v2 API - {list_type.title()} List:")
    print("=" * 50)
    print(f"Found {len(items)} {list_type}s:")
    print("-" * 30)
    
    for item_id, item_info in items.items():
        print(f"ID: {item_id}")
        print(f"Name: {item_info.get('name', 'N/A')}")
        print(f"Language: {item_info.get('language', 'N/A')}")
        if 'author' in item_info:
            print(f"Author: {item_info.get('author', 'N/A')}")
        if 'style' in item_info:
            print(f"Style: {item_info.get('style', 'N/A')}")
        print("-" * 20)

def compare_v1_v2():
    """
    Compare v1 and v2 API responses
    """
    print("Comparing v1 vs v2 API responses:")
    print("=" * 50)
    
    # Fetch v2 data
    v2_data = fetch_v2_list('translation')
    
    if v2_data:
        print("v2 API Response Structure:")
        print("- More organized data structure")
        print("- Better error handling")
        print("- Consistent response format")
        print("- Enhanced metadata")
        
        print("\nExample v2 usage:")
        print("https://api.globalquran.com/v2/list/translation?key=YOUR_API_KEY")
        print("https://api.globalquran.com/v2/list/recitor?key=YOUR_API_KEY")
        print("https://api.globalquran.com/v2/list/quran?key=YOUR_API_KEY")

# Main execution
if __name__ == "__main__":
    print("Testing v2 API Lists...")
    print()
    
    # Test translation list
    print("1. Translation List:")
    translation_data = fetch_v2_list('translation')
    if translation_data:
        display_v2_list(translation_data, 'translation')
    print()
    
    # Test recitor list
    print("2. Recitor List:")
    recitor_data = fetch_v2_list('recitor')
    if recitor_data:
        display_v2_list(recitor_data, 'recitor')
    print()
    
    # Test quran list
    print("3. Quran List:")
    quran_data = fetch_v2_list('quran')
    if quran_data:
        display_v2_list(quran_data, 'quran')
    print()
    
    # Compare APIs
    compare_v1_v2()

# Expected Response Structure (v2 API):
# {
#   "translation": {
#     "en.sahih": {
#       "name": "Sahih International",
#       "language": "English",
#       "author": "Sahih International",
#       "version": "1.0"
#     }
#   },
#   "meta": {
#     "api_version": "2.0",
#     "total_count": 150,
#     "last_updated": "2024-01-01T00:00:00Z"
#   }
# }
