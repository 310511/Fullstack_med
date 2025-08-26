from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import joblib
import hashlib
import json
import uuid
from datetime import datetime, timedelta
import asyncio
import aiohttp
import os
from pathlib import Path
import re

# Initialize FastAPI app
app = FastAPI(title="Enhanced GeneChain API", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class GeneExpressionRequest(BaseModel):
    patient_id: str
    model_type: str = "svm"  # "random_forest", "svm", "mlp"
    user_role: str = "Doctor"

class PromoterRequest(BaseModel):
    sequence: str
    patient_id: Optional[str] = None
    user_role: str = "Doctor"

class ConsentRequest(BaseModel):
    patient_id: str
    requester_id: str
    requester_role: str
    request_type: str = "read"  # "read", "write", "full"
    duration: int = 30  # days

class AnalysisResult(BaseModel):
    patient_id: str
    prediction: str
    probability: float
    model_hash: str
    blockchain_tx: str
    timestamp: str
    top_genes: List[Dict[str, Any]]
    model_type: str
    user_role: str

class PromoterResult(BaseModel):
    id: str
    sequence: str
    prediction: str
    probability: float
    model_hash: str
    blockchain_tx: str
    timestamp: str
    reference_matches: List[Dict[str, Any]]
    patient_id: Optional[str]
    user_role: str

class ConsentResult(BaseModel):
    id: str
    patient_id: str
    requester_id: str
    requester_role: str
    request_type: str
    duration: int
    status: str
    timestamp: str
    expiry_date: str
    blockchain_tx: str

class AuditLog(BaseModel):
    id: str
    patient_id: str
    action: str
    model_hash: str
    prediction: str
    probability: float
    blockchain_tx: str
    timestamp: str
    user_role: str

# Global variables for ML models and data
models = {}
scalers = {}
feature_names = []
promoter_model = None
is_models_loaded = False

# Mock blockchain integration
class MockBlockchain:
    def __init__(self):
        self.transactions = []
        self.block_number = 1000000
        self.consent_contracts = {}
    
    async def log_analysis(self, patient_id: str, model_hash: str, prediction: str, probability: float) -> str:
        """Mock blockchain transaction for analysis"""
        tx_hash = f"0x{hashlib.md5(f'{patient_id}{model_hash}{datetime.now().isoformat()}'.encode()).hexdigest()[:16]}"
        self.transactions.append({
            "tx_hash": tx_hash,
            "patient_id": patient_id,
            "model_hash": model_hash,
            "prediction": prediction,
            "probability": probability,
            "block_number": self.block_number,
            "timestamp": datetime.now().isoformat(),
            "type": "analysis"
        })
        self.block_number += 1
        return tx_hash
    
    async def log_promoter_validation(self, sequence_hash: str, prediction: str, probability: float) -> str:
        """Mock blockchain transaction for promoter validation"""
        tx_hash = f"0x{hashlib.md5(f'{sequence_hash}{prediction}{datetime.now().isoformat()}'.encode()).hexdigest()[:16]}"
        self.transactions.append({
            "tx_hash": tx_hash,
            "sequence_hash": sequence_hash,
            "prediction": prediction,
            "probability": probability,
            "block_number": self.block_number,
            "timestamp": datetime.now().isoformat(),
            "type": "promoter"
        })
        self.block_number += 1
        return tx_hash
    
    async def log_consent(self, patient_id: str, requester_id: str, action: str, duration: int) -> str:
        """Mock blockchain transaction for consent management"""
        tx_hash = f"0x{hashlib.md5(f'{patient_id}{requester_id}{action}{datetime.now().isoformat()}'.encode()).hexdigest()[:16]}"
        
        # Store consent in smart contract
        consent_key = f"{patient_id}_{requester_id}"
        if action == "grant":
            expiry_date = datetime.now() + timedelta(days=duration)
            self.consent_contracts[consent_key] = {
                "status": "active",
                "expiry_date": expiry_date.isoformat(),
                "granted_at": datetime.now().isoformat()
            }
        elif action == "revoke":
            if consent_key in self.consent_contracts:
                self.consent_contracts[consent_key]["status"] = "revoked"
        
        self.transactions.append({
            "tx_hash": tx_hash,
            "patient_id": patient_id,
            "requester_id": requester_id,
            "action": action,
            "duration": duration,
            "block_number": self.block_number,
            "timestamp": datetime.now().isoformat(),
            "type": "consent"
        })
        self.block_number += 1
        return tx_hash
    
    async def get_audit_trail(self, patient_id: Optional[str] = None, log_type: Optional[str] = None) -> List[Dict]:
        """Get audit trail from blockchain"""
        filtered_logs = self.transactions
        
        if patient_id:
            filtered_logs = [tx for tx in filtered_logs if tx.get("patient_id") == patient_id]
        
        if log_type:
            filtered_logs = [tx for tx in filtered_logs if tx.get("type") == log_type]
        
        return filtered_logs
    
    async def get_consent_status(self, patient_id: str, requester_id: str) -> Optional[Dict]:
        """Get consent status from smart contract"""
        consent_key = f"{patient_id}_{requester_id}"
        return self.consent_contracts.get(consent_key)

blockchain = MockBlockchain()

# ML Model Management
def load_ml_models():
    """Load pre-trained ML models"""
    global models, scalers, feature_names, promoter_model, is_models_loaded
    
    try:
        # Create models directory if it doesn't exist
        models_dir = Path("models")
        models_dir.mkdir(exist_ok=True)
        
        # Check if models exist, if not create mock models
        if not (models_dir / "random_forest.joblib").exists():
            create_mock_models()
        
        # Load gene expression models
        models["random_forest"] = joblib.load(models_dir / "random_forest.joblib")
        models["svm"] = joblib.load(models_dir / "svm.joblib")
        models["mlp"] = joblib.load(models_dir / "mlp.joblib")
        
        # Load scalers
        scalers["random_forest"] = joblib.load(models_dir / "rf_scaler.joblib")
        scalers["svm"] = joblib.load(models_dir / "svm_scaler.joblib")
        scalers["mlp"] = joblib.load(models_dir / "mlp_scaler.joblib")
        
        # Load feature names
        with open(models_dir / "feature_names.json", "r") as f:
            feature_names = json.load(f)
        
        # Load promoter model
        promoter_model = joblib.load(models_dir / "promoter_model.joblib")
        
        is_models_loaded = True
        print("✅ Enhanced ML models loaded successfully")
        
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        create_mock_models()
        is_models_loaded = True

def create_mock_models():
    """Create mock ML models for demonstration"""
    global models, scalers, feature_names, promoter_model
    
    # Create mock feature names (common genes in ALL/AML)
    feature_names = [
        "CD19", "CD20", "CD22", "CD79A", "PAX5", "CD10", "CD34", "CD38",
        "CD45", "CD33", "CD13", "CD14", "CD15", "CD11b", "CD64", "CD117",
        "MPO", "TdT", "CD3", "CD7", "CD2", "CD5", "CD8", "CD4"
    ]
    
    # Create mock training data for gene expression
    np.random.seed(42)
    n_samples = 1000
    n_features = len(feature_names)
    
    # Generate mock gene expression data
    X = np.random.randn(n_samples, n_features)
    # ALL samples (0) and AML samples (1)
    y = np.random.choice([0, 1], n_samples, p=[0.6, 0.4])
    
    # Create and train gene expression models
    models = {}
    scalers = {}
    
    # Random Forest
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_scaler = StandardScaler()
    X_rf_scaled = rf_scaler.fit_transform(X)
    rf.fit(X_rf_scaled, y)
    models["random_forest"] = rf
    scalers["random_forest"] = rf_scaler
    
    # SVM
    svm = SVC(kernel='rbf', probability=True, random_state=42)
    svm_scaler = StandardScaler()
    X_svm_scaled = svm_scaler.fit_transform(X)
    svm.fit(X_svm_scaled, y)
    models["svm"] = svm
    scalers["svm"] = svm_scaler
    
    # MLP
    mlp = MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=500, random_state=42)
    mlp_scaler = StandardScaler()
    X_mlp_scaled = mlp_scaler.fit_transform(X)
    mlp.fit(X_mlp_scaled, y)
    models["mlp"] = mlp
    scalers["mlp"] = mlp_scaler
    
    # Create promoter model (Logistic Regression for sequence classification)
    # Mock promoter sequences (simplified)
    promoter_sequences = []
    promoter_labels = []
    
    # Generate mock promoter/non-promoter sequences
    for i in range(500):
        # Mock promoter sequence (with TATA box-like pattern)
        if i < 250:
            seq = "ATCG" * 10 + "TATAAA" + "ATCG" * 10
            promoter_sequences.append(seq)
            promoter_labels.append(1)
        else:
            # Mock non-promoter sequence
            seq = "ATCG" * 26
            promoter_sequences.append(seq)
            promoter_labels.append(0)
    
    # Convert sequences to features (simplified)
    X_promoter = np.array([[seq.count('A'), seq.count('T'), seq.count('C'), seq.count('G')] for seq in promoter_sequences])
    y_promoter = np.array(promoter_labels)
    
    # Train promoter model
    promoter_model = LogisticRegression(random_state=42)
    promoter_model.fit(X_promoter, y_promoter)
    
    # Save models
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    joblib.dump(models["random_forest"], models_dir / "random_forest.joblib")
    joblib.dump(models["svm"], models_dir / "svm.joblib")
    joblib.dump(models["mlp"], models_dir / "mlp.joblib")
    
    joblib.dump(scalers["random_forest"], models_dir / "rf_scaler.joblib")
    joblib.dump(scalers["svm"], models_dir / "svm_scaler.joblib")
    joblib.dump(scalers["mlp"], models_dir / "mlp_scaler.joblib")
    
    joblib.dump(promoter_model, models_dir / "promoter_model.joblib")
    
    with open(models_dir / "feature_names.json", "w") as f:
        json.dump(feature_names, f)
    
    print("✅ Enhanced mock ML models created and saved")

def preprocess_gene_expression_data(data: pd.DataFrame) -> np.ndarray:
    """Preprocess gene expression data"""
    # Handle missing values
    data = data.fillna(0)
    
    # Ensure we have the expected features
    if len(data.columns) != len(feature_names):
        # If we have more features, select the most important ones
        if len(data.columns) > len(feature_names):
            data = data.iloc[:, :len(feature_names)]
        # If we have fewer features, pad with zeros
        else:
            padding = pd.DataFrame(0, index=data.index, columns=feature_names[len(data.columns):])
            data = pd.concat([data, padding], axis=1)
    
    # Ensure column names match
    data.columns = feature_names
    
    return data.values

def preprocess_promoter_sequence(sequence: str) -> np.ndarray:
    """Preprocess promoter sequence for ML analysis"""
    # Clean sequence
    sequence = sequence.upper().replace(' ', '').replace('\n', '')
    
    # Extract features (simplified)
    features = [
        sequence.count('A'),
        sequence.count('T'),
        sequence.count('C'),
        sequence.count('G')
    ]
    
    return np.array(features).reshape(1, -1)

def get_top_contributing_genes(model, feature_importance, n_top: int = 5) -> List[Dict[str, Any]]:
    """Get top contributing genes for prediction"""
    if hasattr(model, 'feature_importances_'):
        # For Random Forest
        indices = np.argsort(feature_importance)[::-1][:n_top]
    elif hasattr(model, 'coef_'):
        # For SVM
        indices = np.argsort(np.abs(model.coef_[0]))[::-1][:n_top]
    else:
        # For MLP or other models, use random importance
        indices = np.random.choice(len(feature_names), n_top, replace=False)
    
    return [
        {
            "gene": feature_names[i],
            "importance": float(feature_importance[i]) if i < len(feature_importance) else 0.1
        }
        for i in indices
    ]

async def analyze_gene_expression(data: np.ndarray, model_type: str, patient_id: str) -> Dict[str, Any]:
    """Analyze gene expression data using ML models"""
    if not is_models_loaded:
        load_ml_models()
    
    if model_type not in models:
        raise ValueError(f"Model type {model_type} not available")
    
    # Preprocess data
    scaler = scalers[model_type]
    X_scaled = scaler.transform(data)
    
    # Make prediction
    model = models[model_type]
    prediction_proba = model.predict_proba(X_scaled)[0]
    prediction = "ALL" if prediction_proba[0] > prediction_proba[1] else "AML"
    probability = max(prediction_proba)
    
    # Get feature importance
    if hasattr(model, 'feature_importances_'):
        feature_importance = model.feature_importances_
    elif hasattr(model, 'coef_'):
        feature_importance = np.abs(model.coef_[0])
    else:
        feature_importance = np.random.rand(len(feature_names))
    
    top_genes = get_top_contributing_genes(model, feature_importance)
    
    # Generate model hash
    model_hash = hashlib.sha256(f"{model_type}{patient_id}{datetime.now().isoformat()}".encode()).hexdigest()[:16]
    
    # Log to blockchain
    blockchain_tx = await blockchain.log_analysis(patient_id, model_hash, prediction, probability)
    
    return {
        "prediction": prediction,
        "probability": probability,
        "model_hash": model_hash,
        "blockchain_tx": blockchain_tx,
        "top_genes": top_genes,
        "timestamp": datetime.now().isoformat()
    }

async def validate_promoter(sequence: str) -> Dict[str, Any]:
    """Validate promoter sequence using ML model"""
    if not is_models_loaded:
        load_ml_models()
    
    # Preprocess sequence
    X = preprocess_promoter_sequence(sequence)
    
    # Make prediction
    prediction_proba = promoter_model.predict_proba(X)[0]
    prediction = "promoter" if prediction_proba[1] > prediction_proba[0] else "not_promoter"
    probability = max(prediction_proba)
    
    # Generate model hash
    sequence_hash = hashlib.md5(sequence.encode()).hexdigest()[:8]
    model_hash = hashlib.sha256(f"promoter{sequence_hash}{datetime.now().isoformat()}".encode()).hexdigest()[:16]
    
    # Log to blockchain
    blockchain_tx = await blockchain.log_promoter_validation(sequence_hash, prediction, probability)
    
    # Mock reference database matches
    reference_matches = [
        {"database": "NCBI", "match": "NM_001123456", "score": 0.95},
        {"database": "Ensembl", "match": "ENST00000123456", "score": 0.87}
    ]
    
    return {
        "prediction": prediction,
        "probability": probability,
        "model_hash": model_hash,
        "blockchain_tx": blockchain_tx,
        "reference_matches": reference_matches,
        "timestamp": datetime.now().isoformat()
    }

# API Endpoints
@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    load_ml_models()

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Enhanced GeneChain API", "version": "2.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": is_models_loaded,
        "available_models": list(models.keys()) if is_models_loaded else [],
        "promoter_model_loaded": promoter_model is not None,
        "timestamp": datetime.now().isoformat()
    }

# Gene Expression Analysis Endpoints
@app.post("/analyze", response_model=AnalysisResult)
async def analyze_gene_expression_endpoint(
    file: UploadFile = File(...),
    patient_id: str = Form(None),
    model_type: str = Form("svm"),
    user_role: str = Form("Doctor")
):
    """Analyze gene expression data"""
    try:
        # Validate file
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
        # Read CSV file
        content = await file.read()
        df = pd.read_csv(pd.io.common.BytesIO(content))
        
        # Generate patient ID if not provided
        if not patient_id:
            patient_id = f"P{uuid.uuid4().hex[:8].upper()}"
        
        # Preprocess data
        data = preprocess_gene_expression_data(df)
        
        # Analyze data
        result = await analyze_gene_expression(data, model_type, patient_id)
        
        # Create response
        analysis_result = AnalysisResult(
            patient_id=patient_id,
            prediction=result["prediction"],
            probability=result["probability"],
            model_hash=result["model_hash"],
            blockchain_tx=result["blockchain_tx"],
            timestamp=result["timestamp"],
            top_genes=result["top_genes"],
            model_type=model_type,
            user_role=user_role
        )
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# Promoter Validation Endpoints
@app.post("/validate", response_model=PromoterResult)
async def validate_promoter_endpoint(
    sequence: str = Form(...),
    patient_id: str = Form(None),
    user_role: str = Form("Doctor")
):
    """Validate promoter sequence"""
    try:
        # Validate sequence
        if not re.match(r'^[ATCG]+$', sequence.upper()):
            raise HTTPException(status_code=400, detail="Invalid DNA sequence")
        
        # Generate ID if not provided
        if not patient_id:
            patient_id = f"P{uuid.uuid4().hex[:8].upper()}"
        
        # Validate promoter
        result = await validate_promoter(sequence)
        
        # Create response
        promoter_result = PromoterResult(
            id=str(uuid.uuid4()),
            sequence=sequence,
            prediction=result["prediction"],
            probability=result["probability"],
            model_hash=result["model_hash"],
            blockchain_tx=result["blockchain_tx"],
            timestamp=result["timestamp"],
            reference_matches=result["reference_matches"],
            patient_id=patient_id,
            user_role=user_role
        )
        
        return promoter_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Promoter validation failed: {str(e)}")

# Consent Management Endpoints
@app.post("/consent/grant")
async def grant_consent(consent_request: ConsentRequest):
    """Grant consent for data access"""
    try:
        # Log consent to blockchain
        blockchain_tx = await blockchain.log_consent(
            consent_request.patient_id,
            consent_request.requester_id,
            "grant",
            consent_request.duration
        )
        
        # Calculate expiry date
        expiry_date = datetime.now() + timedelta(days=consent_request.duration)
        
        # Create consent result
        consent_result = ConsentResult(
            id=str(uuid.uuid4()),
            patient_id=consent_request.patient_id,
            requester_id=consent_request.requester_id,
            requester_role=consent_request.requester_role,
            request_type=consent_request.request_type,
            duration=consent_request.duration,
            status="approved",
            timestamp=datetime.now().isoformat(),
            expiry_date=expiry_date.isoformat(),
            blockchain_tx=blockchain_tx
        )
        
        return consent_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Consent grant failed: {str(e)}")

@app.post("/consent/revoke")
async def revoke_consent(patient_id: str, requester_id: str):
    """Revoke consent for data access"""
    try:
        # Log revocation to blockchain
        blockchain_tx = await blockchain.log_consent(patient_id, requester_id, "revoke", 0)
        
        return {
            "status": "revoked",
            "patient_id": patient_id,
            "requester_id": requester_id,
            "blockchain_tx": blockchain_tx,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Consent revocation failed: {str(e)}")

@app.get("/consent/history/{patient_id}")
async def get_consent_history(patient_id: str):
    """Get consent history for a patient"""
    try:
        consent_logs = await blockchain.get_audit_trail(patient_id, "consent")
        return {
            "patient_id": patient_id,
            "consent_logs": consent_logs,
            "total_records": len(consent_logs)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve consent history: {str(e)}")

# Audit Trail Endpoints
@app.get("/audit/{patient_id}")
async def get_audit_trail(patient_id: str):
    """Get audit trail for a specific patient"""
    try:
        audit_logs = await blockchain.get_audit_trail(patient_id)
        return {
            "patient_id": patient_id,
            "audit_logs": audit_logs,
            "total_records": len(audit_logs)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve audit trail: {str(e)}")

@app.get("/audit")
async def get_all_audit_logs(log_type: Optional[str] = None):
    """Get all audit logs"""
    try:
        audit_logs = await blockchain.get_audit_trail(log_type=log_type)
        return {
            "audit_logs": audit_logs,
            "total_records": len(audit_logs),
            "log_type": log_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve audit logs: {str(e)}")

# Reports Endpoints
@app.post("/reports/generate")
async def generate_report(
    report_type: str = Form(...),
    patient_id: Optional[str] = Form(None),
    start_date: Optional[str] = Form(None),
    end_date: Optional[str] = Form(None)
):
    """Generate comprehensive reports"""
    try:
        # Mock report generation
        report_id = str(uuid.uuid4())
        report_data = {
            "id": report_id,
            "type": report_type,
            "patient_id": patient_id,
            "start_date": start_date or datetime.now().isoformat(),
            "end_date": end_date or datetime.now().isoformat(),
            "generated_at": datetime.now().isoformat(),
            "download_url": f"/reports/{report_id}.pdf",
            "status": "generated"
        }
        
        return report_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")

# Statistics Endpoints
@app.get("/stats")
async def get_statistics():
    """Get system statistics"""
    try:
        all_logs = await blockchain.get_audit_trail()
        
        # Calculate statistics
        total_analyses = len([log for log in all_logs if log.get("type") == "analysis"])
        total_promoters = len([log for log in all_logs if log.get("type") == "promoter"])
        total_consents = len([log for log in all_logs if log.get("type") == "consent"])
        
        # Gene expression statistics
        gene_logs = [log for log in all_logs if log.get("type") == "analysis"]
        all_predictions = sum(1 for log in gene_logs if log.get("prediction") == "ALL")
        aml_predictions = sum(1 for log in gene_logs if log.get("prediction") == "AML")
        
        return {
            "total_analyses": total_analyses,
            "total_promoter_validations": total_promoters,
            "total_consent_operations": total_consents,
            "all_predictions": all_predictions,
            "aml_predictions": aml_predictions,
            "blockchain_transactions": len(all_logs),
            "average_confidence": np.mean([log.get("probability", 0) for log in gene_logs]) if gene_logs else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve statistics: {str(e)}")

@app.get("/models")
async def get_available_models():
    """Get available ML models"""
    return {
        "available_models": list(models.keys()) if is_models_loaded else [],
        "model_descriptions": {
            "random_forest": "Random Forest Classifier - Baseline model",
            "svm": "Support Vector Machine with RBF kernel - Recommended",
            "mlp": "Multi-layer Perceptron - Experimental"
        },
        "promoter_model": "Logistic Regression - Promoter sequence classification"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)


