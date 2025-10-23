# Python Example: Recitor List
# This example shows how to fetch available recitors using the GlobalQuran API

import requests
import json

# API Endpoint
endpoint = 'https://api.globalquran.com/v1/list/recitor?key=YOUR_API_KEY'

def fetch_recitors():
    """
    Function to fetch available recitors
    
    Returns:
        dict: API response data or None if error
    """
    try:
        response = requests.get(endpoint)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        
        data = response.json()
        return data
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching recitors: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None

def display_recitors(data):
    """
    Display recitors in a formatted way
    
    Args:
        data (dict): API response data
    """
    if not data or 'recitor' not in data:
        print("No recitor data available")
        return
    
    recitors = data['recitor']
    print(f"Found {len(recitors)} recitors:")
    print("-" * 50)
    
    for recitor_id, recitor_info in recitors.items():
        print(f"ID: {recitor_id}")
        print(f"Name: {recitor_info.get('name', 'N/A')}")
        print(f"Language: {recitor_info.get('language', 'N/A')}")
        print(f"Style: {recitor_info.get('style', 'N/A')}")
        print("-" * 30)

# Main execution
if __name__ == "__main__":
    print("Fetching available recitors...")
    data = fetch_recitors()
    
    if data:
        display_recitors(data)
        
        # Example of using a specific recitor
        if 'recitor' in data:
            first_recitor = list(data['recitor'].keys())[0]
            print(f"\nExample usage with recitor ID '{first_recitor}':")
            print(f"https://api.globalquran.com/v1/surah/1/{first_recitor}?key=YOUR_API_KEY")
    else:
        print("Failed to fetch recitors")

# Expected Response Structure:
# {
#   "recitor": {
#     "abdul_basit_murattal": {
#       "name": "Abdul Basit Murattal",
#       "language": "Arabic",
#       "style": "Murattal"
#     },
#     "abdul_basit_mujawwad": {
#       "name": "Abdul Basit Mujawwad", 
#       "language": "Arabic",
#       "style": "Mujawwad"
#     }
#   }
# }
