from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from contextlib import asynccontextmanager
import pandas as pd
import numpy as np
import hashlib
import json
import uuid
import re
from datetime import datetime, timedelta
from pathlib import Path
import asyncio
import aiohttp
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import joblib
import sqlite3
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and load ML models on startup"""
    print("🚀 Starting Promoter Validation API...")
    
    # Initialize database
    init_database()
    
    # Load ML models
    global ml_model
    ml_model = PromoterMLModel()
    ml_model.load_models()
    
    print("✅ Promoter ML models loaded successfully")
    yield
    print("🛑 Shutting down Promoter Validation API...")

# Initialize FastAPI app
app = FastAPI(title="Promoter Validation API", version="1.0.0", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class PromoterValidationRequest(BaseModel):
    sequence: str
    patient_id: Optional[str] = None
    analyst_id: str = "ANALYST001"
    user_role: str = "Doctor"

class PromoterValidationResult(BaseModel):
    id: str
    patient_id: Optional[str]
    analyst_id: str
    sequence_hash: str
    prediction: str
    probability: float
    motifs_found: List[Dict[str, Any]]
    model_version_hash: str
    validation_hash: str
    blockchain_tx: str
    timestamp: str
    user_role: str
    
    class Config:
        protected_namespaces = ()

class BlockchainLogRequest(BaseModel):
    patient_id: str
    validation_id: str

class ValidationHistory(BaseModel):
    patient_id: str
    validations: List[Dict[str, Any]]
    total_count: int

# Database connection
def get_db_connection():
    try:
        conn = sqlite3.connect('promoter_validation.db')
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

# Initialize database tables
def init_database():
    conn = get_db_connection()
    if conn:
        try:
            cur = conn.cursor()
            # Create promoter_validations table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS promoter_validations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    patient_id TEXT,
                    analyst_id TEXT NOT NULL,
                    sequence_hash TEXT NOT NULL,
                    prediction TEXT NOT NULL,
                    probability REAL NOT NULL,
                    motifs_found TEXT,
                    model_version_hash TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    validation_hash TEXT NOT NULL
                )
            """)
            
            # Create chain_logs table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS chain_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    validation_id INTEGER REFERENCES promoter_validations(id),
                    blockchain_tx TEXT NOT NULL,
                    block_number INTEGER,
                    gas_used INTEGER,
                    status TEXT DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            conn.commit()
            print("✅ Database tables initialized successfully")
        except Exception as e:
            print(f"❌ Database initialization error: {e}")
        finally:
            conn.close()
    else:
        print("⚠️ Database connection failed - using in-memory storage")

# ML Model Management
class PromoterMLModel:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.feature_names = []
        self.is_loaded = False
        self.load_models()
    
    def load_models(self):
        """Load or create ML models for promoter validation"""
        try:
            models_dir = Path("models")
            models_dir.mkdir(exist_ok=True)
            
            # Check if models exist, if not create them
            if not (models_dir / "promoter_rf.joblib").exists():
                self.create_mock_models()
            
            # Load models
            self.models["random_forest"] = joblib.load(models_dir / "promoter_rf.joblib")
            self.models["logistic_regression"] = joblib.load(models_dir / "promoter_lr.joblib")
            self.scalers["random_forest"] = joblib.load(models_dir / "promoter_rf_scaler.joblib")
            self.scalers["logistic_regression"] = joblib.load(models_dir / "promoter_lr_scaler.joblib")
            
            # Load feature names
            with open(models_dir / "promoter_features.json", "r") as f:
                self.feature_names = json.load(f)
            
            self.is_loaded = True
            print("✅ Promoter ML models loaded successfully")
            
        except Exception as e:
            print(f"❌ Error loading promoter models: {e}")
            self.create_mock_models()
            self.is_loaded = True
    
    def create_mock_models(self):
        """Create mock ML models for promoter validation"""
        # Create mock promoter sequences
        np.random.seed(42)
        n_samples = 1000
        sequence_length = 100
        
        # Generate mock sequences
        sequences = []
        labels = []
        
        for i in range(n_samples):
            if i < 500:  # Promoter sequences
                # Create sequences with promoter motifs
                seq = self.generate_promoter_sequence(sequence_length)
                sequences.append(seq)
                labels.append(1)
            else:  # Non-promoter sequences
                # Create random sequences
                seq = ''.join(np.random.choice(['A', 'T', 'C', 'G'], sequence_length))
                sequences.append(seq)
                labels.append(0)
        
        # Extract features (k-mer frequencies)
        X = self.extract_features(sequences)
        y = np.array(labels)
        
        # Train Random Forest
        rf = RandomForestClassifier(n_estimators=100, random_state=42)
        rf_scaler = StandardScaler()
        X_rf_scaled = rf_scaler.fit_transform(X)
        rf.fit(X_rf_scaled, y)
        
        # Train Logistic Regression
        lr = LogisticRegression(random_state=42)
        lr_scaler = StandardScaler()
        X_lr_scaled = lr_scaler.fit_transform(X)
        lr.fit(X_lr_scaled, y)
        
        # Save models
        models_dir = Path("models")
        models_dir.mkdir(exist_ok=True)
        
        joblib.dump(rf, models_dir / "promoter_rf.joblib")
        joblib.dump(lr, models_dir / "promoter_lr.joblib")
        joblib.dump(rf_scaler, models_dir / "promoter_rf_scaler.joblib")
        joblib.dump(lr_scaler, models_dir / "promoter_lr_scaler.joblib")
        
        # Save feature names
        self.feature_names = [f"kmer_{i}" for i in range(X.shape[1])]
        with open(models_dir / "promoter_features.json", "w") as f:
            json.dump(self.feature_names, f)
        
        self.models["random_forest"] = rf
        self.models["logistic_regression"] = lr
        self.scalers["random_forest"] = rf_scaler
        self.scalers["logistic_regression"] = lr_scaler
        
        print("✅ Mock promoter ML models created and saved")
    
    def generate_promoter_sequence(self, length):
        """Generate a mock promoter sequence with common motifs"""
        # Common promoter motifs
        tata_box = "TATAAA"
        caat_box = "CAAT"
        minus_10 = "TATAAT"
        minus_35 = "TTGACA"
        
        # Create sequence with motifs
        seq = ""
        remaining_length = length
        
        # Add TATA box
        if remaining_length >= len(tata_box):
            seq += tata_box
            remaining_length -= len(tata_box)
        
        # Add random sequence
        if remaining_length > 0:
            seq += ''.join(np.random.choice(['A', 'T', 'C', 'G'], remaining_length))
        
        return seq
    
    def extract_features(self, sequences, k=3):
        """Extract k-mer frequency features from DNA sequences"""
        features = []
        
        for seq in sequences:
            # Count k-mers
            kmer_counts = {}
            for i in range(len(seq) - k + 1):
                kmer = seq[i:i+k]
                kmer_counts[kmer] = kmer_counts.get(kmer, 0) + 1
            
            # Convert to feature vector
            feature_vector = []
            for i in range(4**k):  # All possible k-mers
                kmer = self.index_to_kmer(i, k)
                feature_vector.append(kmer_counts.get(kmer, 0))
            
            features.append(feature_vector)
        
        return np.array(features)
    
    def index_to_kmer(self, index, k):
        """Convert index to k-mer sequence"""
        bases = ['A', 'T', 'C', 'G']
        kmer = ""
        for i in range(k):
            kmer = bases[index % 4] + kmer
            index //= 4
        return kmer
    
    def predict_promoter(self, sequence, model_type="random_forest"):
        """Predict if sequence is a promoter"""
        if not self.is_loaded:
            self.load_models()
        
        # Extract features
        X = self.extract_features([sequence])
        
        # Scale features
        scaler = self.scalers[model_type]
        X_scaled = scaler.transform(X)
        
        # Make prediction
        model = self.models[model_type]
        prediction_proba = model.predict_proba(X_scaled)[0]
        prediction = "promoter" if prediction_proba[1] > prediction_proba[0] else "non_promoter"
        probability = max(prediction_proba)
        
        return prediction, probability
    
    def detect_motifs(self, sequence):
        """Detect biological motifs in the sequence"""
        motifs = []
        
        # Common promoter motifs
        motif_patterns = {
            "TATA Box": "TATAAA",
            "CAAT Box": "CAAT",
            "-10 Region": "TATAAT",
            "-35 Region": "TTGACA",
            "GC Box": "GGGCGG",
            "CAP Site": "AAATGTG"
        }
        
        for motif_name, pattern in motif_patterns.items():
            if pattern in sequence:
                motifs.append({
                    "name": motif_name,
                    "pattern": pattern,
                    "position": sequence.find(pattern),
                    "found": True
                })
            else:
                motifs.append({
                    "name": motif_name,
                    "pattern": pattern,
                    "position": -1,
                    "found": False
                })
        
        return motifs

# Initialize ML model
ml_model = PromoterMLModel()

# Mock blockchain integration
class MockBlockchain:
    def __init__(self):
        self.transactions = []
        self.block_number = 1000000
    
    async def log_validation(self, sequence_hash: str, model_hash: str, prediction: str, probability: float) -> str:
        """Mock blockchain transaction for promoter validation"""
        tx_hash = f"0x{hashlib.md5(f'{sequence_hash}{model_hash}{datetime.now().isoformat()}'.encode()).hexdigest()[:16]}"
        
        self.transactions.append({
            "tx_hash": tx_hash,
            "sequence_hash": sequence_hash,
            "model_hash": model_hash,
            "prediction": prediction,
            "probability": probability,
            "block_number": self.block_number,
            "timestamp": datetime.now().isoformat(),
            "gas_used": np.random.randint(30000, 60000)
        })
        
        self.block_number += 1
        return tx_hash
    
    async def get_transaction_details(self, tx_hash: str) -> Optional[Dict]:
        """Get transaction details from blockchain"""
        for tx in self.transactions:
            if tx["tx_hash"] == tx_hash:
                return tx
        return None

blockchain = MockBlockchain()

# API Endpoints

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Promoter Validation API",
        "version": "1.0.0",
        "status": "running",
        "features": [
            "DNA sequence validation",
            "ML-based promoter classification",
            "Biological motif detection",
            "Blockchain audit trail",
            "PostgreSQL metadata storage"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    db_status = "healthy" if get_db_connection() else "unhealthy"
    
    return {
        "status": "healthy",
        "database": db_status,
        "ml_models": "loaded" if ml_model.is_loaded else "not_loaded",
        "blockchain": "connected",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/promoter/validate", response_model=PromoterValidationResult)
async def validate_promoter(
    sequence: str = Form(...),
    patient_id: str = Form(None),
    analyst_id: str = Form("ANALYST001"),
    user_role: str = Form("Doctor")
):
    """Validate DNA sequence for promoter classification"""
    try:
        # Validate sequence
        if not re.match(r'^[ATCG]+$', sequence.upper()):
            raise HTTPException(status_code=400, detail="Invalid DNA sequence - only A, T, C, G allowed")
        
        if len(sequence) < 10:
            raise HTTPException(status_code=400, detail="Sequence too short - minimum 10 nucleotides required")
        
        # Clean sequence
        sequence = sequence.upper().replace(' ', '').replace('\n', '')
        
        # Generate sequence hash
        sequence_hash = hashlib.sha256(sequence.encode()).hexdigest()
        
        # Run ML prediction
        prediction, probability = ml_model.predict_promoter(sequence)
        
        # Detect motifs
        motifs_found = ml_model.detect_motifs(sequence)
        
        # Generate model hash
        model_version_hash = hashlib.sha256("promoter_rf_v1.0".encode()).hexdigest()[:16]
        
        # Generate validation hash
        validation_data = f"{sequence_hash}{model_version_hash}{prediction}{probability}"
        validation_hash = hashlib.sha256(validation_data.encode()).hexdigest()[:16]
        
        # Generate patient ID if not provided
        if not patient_id:
            patient_id = f"P{uuid.uuid4().hex[:8].upper()}"
        
        # Store in database
        conn = get_db_connection()
        if conn:
            try:
                cur = conn.cursor()
                cur.execute("""
                    INSERT INTO promoter_validations 
                    (patient_id, analyst_id, sequence_hash, prediction, probability, motifs_found, model_version_hash, validation_hash)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    patient_id, analyst_id, sequence_hash, prediction, probability,
                    json.dumps(motifs_found), model_version_hash, validation_hash
                ))
                
                validation_id = cur.lastrowid
                conn.commit()
            except Exception as e:
                print(f"Database error: {e}")
            finally:
                conn.close()
        
        # Log to blockchain (mock)
        blockchain_tx = await blockchain.log_validation(
            sequence_hash, model_version_hash, prediction, probability
        )
        
        # Create response
        result = PromoterValidationResult(
            id=str(validation_id) if 'validation_id' in locals() else str(uuid.uuid4()),
            patient_id=patient_id,
            analyst_id=analyst_id,
            sequence_hash=sequence_hash,
            prediction=prediction,
            probability=probability,
            motifs_found=motifs_found,
            model_version_hash=model_version_hash,
            validation_hash=validation_hash,
            blockchain_tx=blockchain_tx,
            timestamp=datetime.now().isoformat(),
            user_role=user_role
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

@app.post("/promoter/log-to-chain")
async def log_to_blockchain(request: BlockchainLogRequest):
    """Log validation to blockchain"""
    try:
        # Get validation from database
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cur = conn.cursor()
        cur.execute("""
            SELECT * FROM promoter_validations 
            WHERE id = ? AND patient_id = ?
        """, (request.validation_id, request.patient_id))
        
        validation = cur.fetchone()
        if not validation:
            raise HTTPException(status_code=404, detail="Validation not found")
        
        # Convert to dict for easier access
        validation_dict = dict(validation)
        
        # Log to blockchain
        blockchain_tx = await blockchain.log_validation(
            validation_dict["sequence_hash"],
            validation_dict["model_version_hash"],
            validation_dict["prediction"],
            float(validation_dict["probability"])
        )
        
        # Update database with blockchain info
        cur.execute("""
            INSERT INTO chain_logs (validation_id, blockchain_tx, status)
            VALUES (?, ?, 'confirmed')
        """, (validation_dict["id"], blockchain_tx))
        
        conn.commit()
        
        return {
            "status": "success",
            "blockchain_tx": blockchain_tx,
            "validation_id": request.validation_id,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain logging failed: {str(e)}")

@app.get("/promoter/history/{patient_id}")
async def get_validation_history(patient_id: str):
    """Get validation history for a patient"""
    try:
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cur = conn.cursor()
        cur.execute("""
            SELECT pv.*, cl.blockchain_tx, cl.block_number, cl.gas_used
            FROM promoter_validations pv
            LEFT JOIN chain_logs cl ON pv.id = cl.validation_id
            WHERE pv.patient_id = ?
            ORDER BY pv.created_at DESC
        """, (patient_id,))
        
        validations = [dict(row) for row in cur.fetchall()]
            
            # Convert to list of dicts
            validation_list = []
            for val in validations:
                validation_dict = dict(val)
                validation_dict["created_at"] = val["created_at"].isoformat()
                validation_list.append(validation_dict)
        
        return ValidationHistory(
            patient_id=patient_id,
            validations=validation_list,
            total_count=len(validation_list)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")

@app.get("/promoter/transaction/{tx_hash}")
async def get_transaction_details(tx_hash: str):
    """Get blockchain transaction details"""
    try:
        tx_details = await blockchain.get_transaction_details(tx_hash)
        if not tx_details:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        return {
            "transaction": tx_details,
            "etherscan_url": f"https://sepolia.etherscan.io/tx/{tx_hash}",
            "status": "confirmed"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get transaction details: {str(e)}")

@app.get("/promoter/models")
async def get_available_models():
    """Get available ML models"""
    return {
        "available_models": list(ml_model.models.keys()),
        "model_descriptions": {
            "random_forest": "Random Forest Classifier - High accuracy, good for complex patterns",
            "logistic_regression": "Logistic Regression - Fast, interpretable results"
        },
        "feature_count": len(ml_model.feature_names),
        "is_loaded": ml_model.is_loaded
    }

@app.get("/promoter/stats")
async def get_validation_statistics():
    """Get validation statistics"""
    try:
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cur = conn.cursor()
        # Total validations
        cur.execute("SELECT COUNT(*) as total FROM promoter_validations")
        total = cur.fetchone()[0]
        
        # Promoter vs non-promoter
        cur.execute("""
            SELECT prediction, COUNT(*) as count 
            FROM promoter_validations 
            GROUP BY prediction
        """)
        predictions = cur.fetchall()
        
        # Average confidence
        cur.execute("SELECT AVG(probability) as avg_confidence FROM promoter_validations")
        avg_confidence = cur.fetchone()[0]
        
        # Blockchain transactions
        cur.execute("SELECT COUNT(*) as blockchain_txs FROM chain_logs")
        blockchain_txs = cur.fetchone()[0]
        
        return {
            "total_validations": total,
            "predictions": {p[0]: p[1] for p in predictions},
            "average_confidence": float(avg_confidence) if avg_confidence else 0,
            "blockchain_transactions": blockchain_txs,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get statistics: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)

