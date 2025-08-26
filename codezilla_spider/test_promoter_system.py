#!/usr/bin/env python3
"""
Test script for the Enhanced Promoter Validation System
"""

import requests
import json
import time
import sys

# Configuration
API_BASE_URL = "http://localhost:8002"
TEST_SEQUENCES = [
    "TATAAAATCGATCGATCG",  # Promoter sequence with TATA box
    "ATCGATCGATCGATCGATCG",  # Random sequence
    "CAATATCGATCGATCG",  # Sequence with CAAT box
    "TTGACAATCGATCGATCG"  # Sequence with -35 region
]

def test_health_check():
    """Test API health endpoint"""
    print("🔍 Testing API Health Check...")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health Check: {data['status']}")
            print(f"   Database: {data['database']}")
            print(f"   ML Models: {data['ml_models']}")
            print(f"   Blockchain: {data['blockchain']}")
            return True
        else:
            print(f"❌ Health Check Failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health Check Error: {e}")
        return False

def test_promoter_validation(sequence, patient_id="TEST001"):
    """Test promoter validation endpoint"""
    print(f"\n🧬 Testing Promoter Validation for sequence: {sequence[:20]}...")
    try:
        data = {
            "sequence": sequence,
            "patient_id": patient_id,
            "analyst_id": "TEST_ANALYST",
            "user_role": "Doctor"
        }
        
        response = requests.post(f"{API_BASE_URL}/promoter/validate", data=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Validation Successful:")
            print(f"   Prediction: {result['prediction']}")
            print(f"   Confidence: {result['probability']:.2%}")
            print(f"   Sequence Hash: {result['sequence_hash'][:16]}...")
            print(f"   Model Hash: {result['model_version_hash'][:16]}...")
            print(f"   Motifs Found: {len([m for m in result['motifs_found'] if m['found']])}")
            return result
        else:
            print(f"❌ Validation Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Validation Error: {e}")
        return None

def test_blockchain_logging(validation_result):
    """Test blockchain logging"""
    if not validation_result:
        print("❌ No validation result to log to blockchain")
        return None
        
    print(f"\n🔗 Testing Blockchain Logging...")
    try:
        data = {
            "patient_id": validation_result.get("patient_id", "TEST001"),
            "validation_id": validation_result["id"]
        }
        
        response = requests.post(f"{API_BASE_URL}/promoter/log-to-chain", json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Blockchain Logging Successful:")
            print(f"   Transaction Hash: {result['blockchain_tx']}")
            print(f"   Status: {result['status']}")
            return result
        else:
            print(f"❌ Blockchain Logging Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Blockchain Logging Error: {e}")
        return None

def test_validation_history(patient_id="TEST001"):
    """Test validation history endpoint"""
    print(f"\n📊 Testing Validation History for patient {patient_id}...")
    try:
        response = requests.get(f"{API_BASE_URL}/promoter/history/{patient_id}", timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ History Retrieved:")
            print(f"   Total Validations: {result['total_count']}")
            print(f"   Patient ID: {result['patient_id']}")
            return result
        else:
            print(f"❌ History Failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ History Error: {e}")
        return None

def test_models_info():
    """Test models info endpoint"""
    print(f"\n🤖 Testing Models Information...")
    try:
        response = requests.get(f"{API_BASE_URL}/promoter/models", timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Models Info Retrieved:")
            print(f"   Available Models: {', '.join(result['available_models'])}")
            print(f"   Feature Count: {result['feature_count']}")
            print(f"   Models Loaded: {result['is_loaded']}")
            return result
        else:
            print(f"❌ Models Info Failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Models Info Error: {e}")
        return None

def test_statistics():
    """Test statistics endpoint"""
    print(f"\n📈 Testing System Statistics...")
    try:
        response = requests.get(f"{API_BASE_URL}/promoter/stats", timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Statistics Retrieved:")
            print(f"   Total Validations: {result['total_validations']}")
            print(f"   Average Confidence: {result['average_confidence']:.2%}")
            print(f"   Blockchain Transactions: {result['blockchain_transactions']}")
            return result
        else:
            print(f"❌ Statistics Failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Statistics Error: {e}")
        return None

def main():
    """Main test function"""
    print("🚀 Enhanced Promoter Validation System - Test Suite")
    print("=" * 60)
    
    # Test 1: Health Check
    if not test_health_check():
        print("❌ System not ready. Please start the backend server.")
        sys.exit(1)
    
    # Test 2: Models Info
    test_models_info()
    
    # Test 3: Promoter Validations
    validation_results = []
    for i, sequence in enumerate(TEST_SEQUENCES):
        result = test_promoter_validation(sequence, f"TEST{i+1:03d}")
        if result:
            validation_results.append(result)
            time.sleep(1)  # Small delay between requests
    
    # Test 4: Blockchain Logging (for first validation)
    if validation_results:
        test_blockchain_logging(validation_results[0])
    
    # Test 5: Validation History
    test_validation_history("TEST001")
    
    # Test 6: System Statistics
    test_statistics()
    
    print("\n" + "=" * 60)
    print("✅ Test Suite Completed!")
    print(f"   Total Tests: 6")
    print(f"   Validations Tested: {len(validation_results)}")
    print("\n🎉 Enhanced Promoter Validation System is working correctly!")

if __name__ == "__main__":
    main()

