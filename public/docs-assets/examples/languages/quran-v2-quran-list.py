# v2 Quran List - Python Example
# This example demonstrates how to fetch and display Quran formats using the v2 API

import requests
import json
from typing import Dict, List, Optional, Any

# Configuration
API_BASE = 'https://api.globalquran.com/v2'
API_KEY = 'REPLACE_WITH_YOUR_KEY'  # Replace with your actual API key

def fetch_quran_formats(api_key: str) -> Dict[str, Any]:
    """
    Fetch Quran formats from the v2 API
    
    Args:
        api_key: Your GlobalQuran API key
        
    Returns:
        Dictionary containing the API response
        
    Raises:
        requests.RequestException: If the API request fails
        ValueError: If the response is not valid JSON
    """
    url = f"{API_BASE}/list/quran"
    params = {'key': api_key}
    
    headers = {
        'Accept': 'application/json',
        'User-Agent': 'Python-v2-Quran-Example'
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

def display_quran_formats(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Display Quran formats list with full details
    
    Args:
        data: API response data
        
    Returns:
        List of Quran format objects
    """
    print("=== v2 QURAN FORMATS API RESPONSE ===")
    print("Raw JSON Response:")
    print(json.dumps(data, indent=2))
    print()
    
    if 'list' in data and isinstance(data['list'], dict):
        quran_formats = list(data['list'].values())
        quran_ids = list(data['list'].keys())
        
        print(f"Found {len(quran_formats)} Quran formats\n")
        
        # Display each Quran format with full details
        for i, quran_format in enumerate(quran_formats):
            quran_id = quran_ids[i]
            print(f"Quran Format {i + 1}:")
            print(f"  ID: {quran_id}")
            print(f"  Name: {quran_format.get('name', 'N/A')}")
            print(f"  English Name: {quran_format.get('english_name', 'N/A')}")
            print(f"  Native Name: {quran_format.get('native_name', 'N/A')}")
            print(f"  Language Code: {quran_format.get('language_code', 'N/A')}")
            print(f"  Type: {quran_format.get('type', 'N/A')}")
            print(f"  Format: {quran_format.get('format', 'N/A')}")
            print(f"  Source: {quran_format.get('source', 'N/A')}")
            print(f"  Default: {'Yes' if quran_format.get('default') else 'No'}")
            print(f"  Supported Version: {quran_format.get('supported_version', 'N/A')}")
            print()
        
        return quran_formats
    else:
        print("No Quran format data found")
        return []

def filter_by_language(quran_formats: List[Dict[str, Any]], language_code: str) -> List[Dict[str, Any]]:
    """
    Filter Quran formats by language code
    
    Args:
        quran_formats: List of Quran format objects
        language_code: Language code to filter by
        
    Returns:
        Filtered list of Quran formats
    """
    return [f for f in quran_formats if f.get('language_code') == language_code]

def get_default_formats(quran_formats: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Get default Quran formats
    
    Args:
        quran_formats: List of Quran format objects
        
    Returns:
        List of default Quran formats
    """
    return [f for f in quran_formats if f.get('default') == True]

def get_formats_by_type(quran_formats: List[Dict[str, Any]], format_type: str) -> List[Dict[str, Any]]:
    """
    Get Quran formats by type
    
    Args:
        quran_formats: List of Quran format objects
        format_type: Type to filter by
        
    Returns:
        List of Quran formats of specified type
    """
    return [f for f in quran_formats if f.get('type') == format_type]

def main():
    """Main function to demonstrate v2 Quran formats API usage"""
    try:
        print("Fetching Quran formats from v2 API...\n")
        data = fetch_quran_formats(API_KEY)
        
        quran_formats = display_quran_formats(data)
        
        # Example: Filter by language
        if quran_formats:
            print("=== FILTERING EXAMPLES ===")
            
            # Get Arabic formats
            arabic_formats = filter_by_language(quran_formats, 'ar')
            print(f"Arabic formats: {len(arabic_formats)}")
            
            # Get English formats
            english_formats = filter_by_language(quran_formats, 'en')
            print(f"English formats: {len(english_formats)}")
            
            # Get default formats
            default_formats = get_default_formats(quran_formats)
            print(f"Default formats: {len(default_formats)}")
            
            # Get translation formats
            translation_formats = get_formats_by_type(quran_formats, 'translation')
            print(f"Translation formats: {len(translation_formats)}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
