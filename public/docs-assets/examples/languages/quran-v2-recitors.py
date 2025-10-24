# v2 Recitors List - Python Example
# This example demonstrates how to fetch and display recitors using the v2 API

import requests
import json
from typing import Dict, List, Optional, Any

# Configuration
API_BASE = 'https://api.globalquran.com/v2'
API_KEY = 'REPLACE_WITH_YOUR_KEY'  # Replace with your actual API key

def fetch_recitors(api_key: str) -> Dict[str, Any]:
    """
    Fetch recitors from the v2 API
    
    Args:
        api_key: Your GlobalQuran API key
        
    Returns:
        Dictionary containing the API response
        
    Raises:
        requests.RequestException: If the API request fails
        ValueError: If the response is not valid JSON
    """
    url = f"{API_BASE}/list/recitor"
    params = {'key': api_key}
    
    headers = {
        'Accept': 'application/json',
        'User-Agent': 'Python-v2-Recitors-Example'
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

def display_recitors(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Display recitors list with full details
    
    Args:
        data: API response data
        
    Returns:
        List of recitor objects
    """
    print("=== v2 RECITORS API RESPONSE ===")
    print("Raw JSON Response:")
    print(json.dumps(data, indent=2))
    print()
    
    if 'list' in data and isinstance(data['list'], dict):
        recitors = list(data['list'].values())
        recitor_ids = list(data['list'].keys())
        
        print(f"Found {len(recitors)} recitors\n")
        
        # Display each recitor with full details
        for i, recitor in enumerate(recitors):
            recitor_id = recitor_ids[i]
            print(f"Recitor {i + 1}:")
            print(f"  ID: {recitor_id}")
            print(f"  Name: {recitor.get('name', 'N/A')}")
            print(f"  English Name: {recitor.get('english_name', 'N/A')}")
            print(f"  Language: {recitor.get('language_code', 'N/A')}")
            print(f"  Type: {recitor.get('type', 'N/A')}")
            print(f"  Format: {recitor.get('format', 'N/A')}")
            print(f"  Default: {'Yes' if recitor.get('default') else 'No'}")
            
            # Display media formats
            if 'media' in recitor and isinstance(recitor['media'], dict):
                print("  Available Formats:")
                for format_name, details in recitor['media'].items():
                    print(f"    {format_name}:")
                    print(f"      Type: {details.get('type', 'N/A')}")
                    print(f"      Bitrate: {details.get('kbs', 'N/A')}kbps")
                    print(f"      Source: {details.get('source', 'N/A')}")
                    print(f"      Status: {details.get('status', 'N/A')}")
            print()
        
        return recitors
    else:
        print("No recitor data found")
        return []

def get_best_audio_format(media_info: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Get the best audio format based on available formats
    
    Args:
        media_info: Media information dictionary
        
    Returns:
        Best format details or None if no formats available
    """
    if not media_info or not isinstance(media_info, dict):
        return None

    # Available formats in order of preference
    formats = []

    # OGG formats (preferred for better quality/size ratio)
    for bitrate in ['192', '128', '64', '32']:
        format_key = f"ogg-{bitrate}"
        if format_key in media_info:
            formats.append(media_info[format_key])

    # MP3 formats (fallback)
    for bitrate in ['192', '128', '64', '32']:
        format_key = f"mp3-{bitrate}"
        if format_key in media_info:
            formats.append(media_info[format_key])

    return formats[0] if formats else None

def construct_audio_url(recitor_id: str, media_info: Dict[str, Any]) -> str:
    """
    Construct audio URL for a recitor
    
    Args:
        recitor_id: Recitor identifier
        media_info: Media information dictionary
        
    Returns:
        Constructed audio URL
    """
    best_format = get_best_audio_format(media_info)
    
    if best_format:
        file_extension = 'ogg' if best_format['type'] == 'ogg' else 'mp3'
        return f"https://audio.globalquran.com/{recitor_id}/{best_format['type']}/{best_format['kbs']}kbs/1.{file_extension}"
    else:
        # Fallback
        return f"https://audio.globalquran.com/{recitor_id}/mp3/128kbs/1.mp3"

def main():
    """Main function to demonstrate v2 recitors API usage"""
    try:
        print("Fetching recitors from v2 API...\n")
        data = fetch_recitors(API_KEY)
        
        recitors = display_recitors(data)
        
        # Example: Get audio URL for first recitor
        if recitors:
            first_recitor = recitors[0]
            recitor_ids = list(data['list'].keys())
            recitor_id = recitor_ids[0]
            
            print("=== AUDIO URL EXAMPLE ===")
            print(f"Recitor: {first_recitor.get('name', 'N/A')}")
            print(f"Available formats: {', '.join(first_recitor.get('media', {}).keys())}")
            
            audio_url = construct_audio_url(recitor_id, first_recitor.get('media', {}))
            print(f"Best audio URL: {audio_url}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
