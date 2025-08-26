from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import joblib
import hashlib
import json
import uuid
from datetime import datetime
import asyncio
import aiohttp
import os
from pathlib import Path

# Initialize FastAPI app
app = FastAPI(title="Gene Expression Audit Trail API", version="1.0.0")

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
is_models_loaded = False

# Mock blockchain integration
class MockBlockchain:
    def __init__(self):
        self.transactions = []
        self.block_number = 1000000
    
    async def log_analysis(self, patient_id: str, model_hash: str, prediction: str, probability: float) -> str:
        """Mock blockchain transaction"""
        tx_hash = f"0x{hashlib.md5(f'{patient_id}{model_hash}{datetime.now().isoformat()}'.encode()).hexdigest()[:16]}"
        self.transactions.append({
            "tx_hash": tx_hash,
            "patient_id": patient_id,
            "model_hash": model_hash,
            "prediction": prediction,
            "probability": probability,
            "block_number": self.block_number,
            "timestamp": datetime.now().isoformat()
        })
        self.block_number += 1
        return tx_hash
    
    async def get_audit_trail(self, patient_id: Optional[str] = None) -> List[Dict]:
        """Get audit trail from blockchain"""
        if patient_id:
            return [tx for tx in self.transactions if tx["patient_id"] == patient_id]
        return self.transactions

blockchain = MockBlockchain()

# ML Model Management
def load_ml_models():
    """Load pre-trained ML models"""
    global models, scalers, feature_names, is_models_loaded
    
    try:
        # Create models directory if it doesn't exist
        models_dir = Path("models")
        models_dir.mkdir(exist_ok=True)
        
        # Check if models exist, if not create mock models
        if not (models_dir / "random_forest.joblib").exists():
            create_mock_models()
        
        # Load models
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
        
        is_models_loaded = True
        print("✅ ML models loaded successfully")
        
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        create_mock_models()
        is_models_loaded = True

def create_mock_models():
    """Create mock ML models for demonstration"""
    global models, scalers, feature_names
    
    # Create mock feature names (common genes in ALL/AML)
    feature_names = [
        "CD19", "CD20", "CD22", "CD79A", "PAX5", "CD10", "CD34", "CD38",
        "CD45", "CD33", "CD13", "CD14", "CD15", "CD11b", "CD64", "CD117",
        "MPO", "TdT", "CD3", "CD7", "CD2", "CD5", "CD8", "CD4"
    ]
    
    # Create mock training data
    np.random.seed(42)
    n_samples = 1000
    n_features = len(feature_names)
    
    # Generate mock gene expression data
    X = np.random.randn(n_samples, n_features)
    # ALL samples (0) and AML samples (1)
    y = np.random.choice([0, 1], n_samples, p=[0.6, 0.4])
    
    # Create and train models
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
    
    # Save models
    models_dir = Path("models")
    models_dir.mkdir(exist_ok=True)
    
    joblib.dump(models["random_forest"], models_dir / "random_forest.joblib")
    joblib.dump(models["svm"], models_dir / "svm.joblib")
    joblib.dump(models["mlp"], models_dir / "mlp.joblib")
    
    joblib.dump(scalers["random_forest"], models_dir / "rf_scaler.joblib")
    joblib.dump(scalers["svm"], models_dir / "svm_scaler.joblib")
    joblib.dump(scalers["mlp"], models_dir / "mlp_scaler.joblib")
    
    with open(models_dir / "feature_names.json", "w") as f:
        json.dump(feature_names, f)
    
    print("✅ Mock ML models created and saved")

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

# API Endpoints
@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    load_ml_models()

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Gene Expression Audit Trail API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": is_models_loaded,
        "available_models": list(models.keys()) if is_models_loaded else [],
        "timestamp": datetime.now().isoformat()
    }

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_gene_expression_endpoint(
    file: UploadFile = File(...),
    patient_id: str = None,
    model_type: str = "svm",
    user_role: str = "Doctor"
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
async def get_all_audit_logs():
    """Get all audit logs"""
    try:
        audit_logs = await blockchain.get_audit_trail()
        return {
            "audit_logs": audit_logs,
            "total_records": len(audit_logs)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve audit logs: {str(e)}")

@app.post("/report")
async def generate_report(patient_id: str, analysis_id: str = None):
    """Generate PDF report (mock implementation)"""
    try:
        # Mock PDF generation
        report_data = {
            "patient_id": patient_id,
            "analysis_id": analysis_id or str(uuid.uuid4()),
            "generated_at": datetime.now().isoformat(),
            "report_url": f"/reports/{patient_id}_{analysis_id}.pdf",
            "status": "generated"
        }
        
        return report_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

@app.get("/models")
async def get_available_models():
    """Get available ML models"""
    return {
        "available_models": list(models.keys()) if is_models_loaded else [],
        "model_descriptions": {
            "random_forest": "Random Forest Classifier - Baseline model",
            "svm": "Support Vector Machine with RBF kernel - Recommended",
            "mlp": "Multi-layer Perceptron - Experimental"
        }
    }

@app.get("/stats")
async def get_statistics():
    """Get system statistics"""
    try:
        audit_logs = await blockchain.get_audit_trail()
        
        # Calculate statistics
        total_analyses = len(audit_logs)
        all_predictions = sum(1 for log in audit_logs if log["prediction"] == "ALL")
        aml_predictions = sum(1 for log in audit_logs if log["prediction"] == "AML")
        
        return {
            "total_analyses": total_analyses,
            "all_predictions": all_predictions,
            "aml_predictions": aml_predictions,
            "blockchain_transactions": len(audit_logs),
            "average_confidence": np.mean([log["probability"] for log in audit_logs]) if audit_logs else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve statistics: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)


