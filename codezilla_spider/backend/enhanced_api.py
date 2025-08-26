from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import numpy as np
import hashlib
import json
import uuid
from datetime import datetime, timedelta
from pathlib import Path

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
    model_type: str = "svm"
    user_role: str = "Doctor"

class PromoterRequest(BaseModel):
    sequence: str
    patient_id: Optional[str] = None
    user_role: str = "Doctor"

class ConsentRequest(BaseModel):
    patient_id: str
    requester_id: str
    requester_role: str
    request_type: str = "read"
    duration: int = 30

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

blockchain = MockBlockchain()

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Enhanced GeneChain API", "version": "2.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
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
        
        # Generate patient ID if not provided
        if not patient_id:
            patient_id = f"P{uuid.uuid4().hex[:8].upper()}"
        
        # Mock analysis result
        prediction = "ALL" if np.random.random() > 0.5 else "AML"
        probability = np.random.random() * 0.3 + 0.7  # 70-100%
        model_hash = f"0x{hashlib.md5(f'{model_type}{patient_id}'.encode()).hexdigest()[:16]}"
        
        # Log to blockchain
        blockchain_tx = await blockchain.log_analysis(patient_id, model_hash, prediction, probability)
        
        # Mock top genes
        top_genes = [
            {"gene": "CD19", "importance": 0.15},
            {"gene": "CD20", "importance": 0.12},
            {"gene": "CD22", "importance": 0.10},
            {"gene": "CD79A", "importance": 0.08},
            {"gene": "PAX5", "importance": 0.07}
        ]
        
        # Create response
        analysis_result = AnalysisResult(
            patient_id=patient_id,
            prediction=prediction,
            probability=probability,
            model_hash=model_hash,
            blockchain_tx=blockchain_tx,
            timestamp=datetime.now().isoformat(),
            top_genes=top_genes,
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
        if not sequence.upper().replace('A', '').replace('T', '').replace('C', '').replace('G', ''):
            raise HTTPException(status_code=400, detail="Invalid DNA sequence")
        
        # Generate ID if not provided
        if not patient_id:
            patient_id = f"P{uuid.uuid4().hex[:8].upper()}"
        
        # Mock promoter validation
        prediction = "promoter" if np.random.random() > 0.5 else "not_promoter"
        probability = np.random.random() * 0.4 + 0.6  # 60-100%
        sequence_hash = hashlib.md5(sequence.encode()).hexdigest()[:8]
        model_hash = f"0x{hashlib.md5(f'promoter{sequence_hash}'.encode()).hexdigest()[:16]}"
        
        # Log to blockchain
        blockchain_tx = await blockchain.log_promoter_validation(sequence_hash, prediction, probability)
        
        # Mock reference database matches
        reference_matches = [
            {"database": "NCBI", "match": "NM_001123456", "score": 0.95},
            {"database": "Ensembl", "match": "ENST00000123456", "score": 0.87}
        ]
        
        # Create response
        promoter_result = PromoterResult(
            id=str(uuid.uuid4()),
            sequence=sequence,
            prediction=prediction,
            probability=probability,
            model_hash=model_hash,
            blockchain_tx=blockchain_tx,
            timestamp=datetime.now().isoformat(),
            reference_matches=reference_matches,
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
        "available_models": ["random_forest", "svm", "mlp"],
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


