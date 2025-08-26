import requests

# Test the API
try:
    # Test health endpoint
    print("Testing health endpoint...")
    response = requests.get('http://localhost:8002/health')
    print(f"Health Status: {response.status_code}")
    print(f"Health Response: {response.json()}")
    
    # Test promoter validation
    print("\nTesting promoter validation...")
    data = {
        'sequence': 'TATAAAATCGATCGATCG',
        'patient_id': 'TEST001',
        'analyst_id': 'TEST_ANALYST',
        'user_role': 'Doctor'
    }
    
    response = requests.post('http://localhost:8002/promoter/validate', data=data)
    print(f"Validation Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Validation Response: {result}")
        print(f"Prediction: {result.get('prediction')}")
        print(f"Confidence: {result.get('probability')}")
    else:
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"Error: {e}")

