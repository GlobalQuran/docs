# v2 Translations List - Python Example
# This example demonstrates how to fetch and display translations using the v2 API

import requests
import json
from typing import Dict, List, Optional, Any

# Configuration
API_BASE = 'https://api.globalquran.com/v2'
API_KEY = 'REPLACE_WITH_YOUR_KEY'  # Replace with your actual API key

def fetch_translations(api_key: str) -> Dict[str, Any]:
    """
    Fetch translations from the v2 API
    
    Args:
        api_key: Your GlobalQuran API key
        
    Returns:
        Dictionary containing the API response
        
    Raises:
        requests.RequestException: If the API request fails
        ValueError: If the response is not valid JSON
    """
    url = f"{API_BASE}/list/translation"
    params = {'key': api_key}
    
    headers = {
        'Accept': 'application/json',
        'User-Agent': 'Python-v2-Translations-Example'
    }
    
    try:
        response = requests.get(url, params=params, headers=headers, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        return data
        
    except requests.exceptions.RequestException as e:
        raise requests.RequestException(f"API request failed: {e}")
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON response: {e}")

def display_translations(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Display translations list with full details
    
    Args:
        data: API response data
        
    Returns:
        List of translation objects
    """
    print("=== v2 TRANSLATIONS API RESPONSE ===")
    print("Raw JSON Response:")
    print(json.dumps(data, indent=2))
    print()
    
    if 'list' in data and isinstance(data['list'], dict):
        translations = list(data['list'].values())
        translation_ids = list(data['list'].keys())
        
        print(f"Found {len(translations)} translations\n")
        
        # Display each translation with full details
        for i, translation in enumerate(translations):
            translation_id = translation_ids[i]
            print(f"Translation {i + 1}:")
            print(f"  ID: {translation_id}")
            print(f"  Name: {translation.get('name', 'N/A')}")
            print(f"  English Name: {translation.get('english_name', 'N/A')}")
            print(f"  Native Name: {translation.get('native_name', 'N/A')}")
            print(f"  Language Code: {translation.get('language_code', 'N/A')}")
            print(f"  Type: {translation.get('type', 'N/A')}")
            print(f"  Format: {translation.get('format', 'N/A')}")
            print(f"  Source: {translation.get('source', 'N/A')}")
            print(f"  Default: {'Yes' if translation.get('default') else 'No'}")
            print(f"  Supported Version: {translation.get('supported_version', 'N/A')}")
            print()
        
        return translations
    else:
        print("No translation data found")
        return []

def filter_by_language(translations: List[Dict[str, Any]], language_code: str) -> List[Dict[str, Any]]:
    """
    Filter translations by language code
    
    Args:
        translations: List of translation objects
        language_code: Language code to filter by
        
    Returns:
        Filtered list of translations
    """
    return [t for t in translations if t.get('language_code') == language_code]

def get_default_translations(translations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Get default translations
    
    Args:
        translations: List of translation objects
        
    Returns:
        List of default translations
    """
    return [t for t in translations if t.get('default') == True]

def main():
    """Main function to demonstrate v2 translations API usage"""
    try:
        print("Fetching translations from v2 API...\n")
        data = fetch_translations(API_KEY)
        
        translations = display_translations(data)
        
        # Example: Filter by language
        if translations:
            print("=== FILTERING EXAMPLES ===")
            
            # Get English translations
            english_translations = filter_by_language(translations, 'en')
            print(f"English translations: {len(english_translations)}")
            
            # Get Arabic translations
            arabic_translations = filter_by_language(translations, 'ar')
            print(f"Arabic translations: {len(arabic_translations)}")
            
            # Get default translations
            default_translations = get_default_translations(translations)
            print(f"Default translations: {len(default_translations)}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
