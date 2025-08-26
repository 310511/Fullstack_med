#!/usr/bin/env python3
"""
GeneChain Blockchain API Endpoints
FastAPI integration for genomic blockchain features
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
import sys
import os

# Add the blockchain module to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'blockchain'))

from gene_chain_enhancements import (
    GenomicBlockchainDashboard,
    GeneExpressionRecord,
    VariantConflictRecord,
    PromoterIntegrityRecord,
    ConsentRecord,
    GeneticRiskRecord,
    ReproducibilityRecord,
    DrugResponseRecord
)

router = APIRouter(prefix="/api/genechain", tags=["GeneChain Blockchain"])

# Initialize the blockchain dashboard
dashboard = GenomicBlockchainDashboard()

# Pydantic models for API requests/responses
class GeneExpressionRequest(BaseModel):
    dataset_name: str
    analysis_type: str
    model_version: str
    results: Dict
    researcher_id: str

class VariantConflictRequest(BaseModel):
    variant_id: str
    original_classification: str
    conflicting_classification: str
    lab_id: str
    evidence_level: str

class PromoterValidationRequest(BaseModel):
    sequence: str
    validator_id: str

class ConsentRequest(BaseModel):
    patient_id: str
    dataset_type: str
    consent_granted: bool
    researcher_id: str

class GeneticRiskRequest(BaseModel):
    patient_id: str
    risk_type: str
    patient_data: Dict
    model_version: str

class ReproducibilityRequest(BaseModel):
    experiment_id: str
    lab_id: str
    raw_data: Dict
    normalized_results: Dict

class DrugResponseRequest(BaseModel):
    patient_id: str
    drug_name: str
    gene_markers: List[str]
    response_prediction: str

class DashboardStatsResponse(BaseModel):
    gene_expression_records: int
    variant_conflicts: int
    promoter_validations: int
    consent_records: int
    genetic_risk_assessments: int
    reproducibility_experiments: int
    drug_response_records: int

@router.get("/dashboard/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats():
    """Get GeneChain blockchain dashboard statistics"""
    try:
        stats = dashboard.get_dashboard_stats()
        return DashboardStatsResponse(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting dashboard stats: {str(e)}")

@router.post("/expression/audit", response_model=Dict)
async def log_gene_expression_analysis(request: GeneExpressionRequest):
    """Log gene expression analysis on blockchain"""
    try:
        record = dashboard.expression_audit.log_expression_analysis(
            request.dataset_name,
            request.analysis_type,
            request.model_version,
            request.results,
            request.researcher_id
        )
        return {
            "status": "success",
            "message": "Gene expression analysis logged on blockchain",
            "record": {
                "dataset_name": record.dataset_name,
                "analysis_type": record.analysis_type,
                "model_version": record.model_version,
                "results_hash": record.results_hash,
                "blockchain_tx_hash": record.blockchain_tx_hash,
                "timestamp": record.timestamp
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error logging gene expression: {str(e)}")

@router.post("/variant/conflict", response_model=Dict)
async def log_variant_conflict(request: VariantConflictRequest):
    """Log variant classification conflict on blockchain"""
    try:
        record = dashboard.variant_resolver.log_variant_conflict(
            request.variant_id,
            request.original_classification,
            request.conflicting_classification,
            request.lab_id,
            request.evidence_level
        )
        return {
            "status": "success",
            "message": "Variant conflict logged on blockchain",
            "record": {
                "variant_id": record.variant_id,
                "original_classification": record.original_classification,
                "conflicting_classification": record.conflicting_classification,
                "lab_id": record.lab_id,
                "evidence_level": record.evidence_level,
                "resolution_status": record.resolution_status,
                "blockchain_tx_hash": record.blockchain_tx_hash,
                "timestamp": record.timestamp
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error logging variant conflict: {str(e)}")

@router.post("/variant/resolve/{variant_id}")
async def resolve_variant_conflict(variant_id: str, resolution: str):
    """Resolve variant conflict"""
    try:
        # Find the record
        for record in dashboard.blockchain.variant_conflict_ledger:
            if record.variant_id == variant_id:
                dashboard.variant_resolver.resolve_conflict(record, resolution)
                return {
                    "status": "success",
                    "message": f"Variant conflict {variant_id} resolved as {resolution}"
                }
        raise HTTPException(status_code=404, detail="Variant conflict not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error resolving variant conflict: {str(e)}")

@router.post("/promoter/validate", response_model=Dict)
async def validate_promoter_sequence(request: PromoterValidationRequest):
    """Validate promoter sequence and store on blockchain"""
    try:
        record = dashboard.promoter_validator.validate_promoter_sequence(
            request.sequence,
            request.validator_id
        )
        return {
            "status": "success",
            "message": "Promoter sequence validated and stored on blockchain",
            "record": {
                "sequence_hash": record.sequence_hash,
                "promoter_prediction": record.promoter_prediction,
                "confidence_score": record.confidence_score,
                "regulatory_checkpoint": record.regulatory_checkpoint,
                "validator_id": record.validator_id,
                "blockchain_tx_hash": record.blockchain_tx_hash,
                "timestamp": record.timestamp
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error validating promoter: {str(e)}")

@router.post("/consent/create", response_model=Dict)
async def create_consent_record(request: ConsentRequest):
    """Create patient consent record on blockchain"""
    try:
        record = dashboard.consent_manager.create_consent_record(
            request.patient_id,
            request.dataset_type,
            request.consent_granted,
            request.researcher_id
        )
        return {
            "status": "success",
            "message": "Consent record created on blockchain",
            "record": {
                "patient_id": record.patient_id,
                "dataset_type": record.dataset_type,
                "consent_granted": record.consent_granted,
                "consent_hash": record.consent_hash,
                "researcher_id": record.researcher_id,
                "smart_contract_address": record.smart_contract_address,
                "timestamp": record.timestamp
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating consent record: {str(e)}")

@router.get("/consent/verify/{patient_id}/{dataset_type}")
async def verify_consent(patient_id: str, dataset_type: str):
    """Verify patient consent for data access"""
    try:
        has_consent = dashboard.consent_manager.verify_consent(patient_id, dataset_type)
        return {
            "status": "success",
            "patient_id": patient_id,
            "dataset_type": dataset_type,
            "has_consent": has_consent
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verifying consent: {str(e)}")

@router.post("/risk/assess", response_model=Dict)
async def assess_genetic_risk(request: GeneticRiskRequest):
    """Assess genetic risk and store on blockchain"""
    try:
        record = dashboard.risk_dashboard.assess_genetic_risk(
            request.patient_id,
            request.risk_type,
            request.patient_data,
            request.model_version
        )
        return {
            "status": "success",
            "message": "Genetic risk assessed and stored on blockchain",
            "record": {
                "patient_id": record.patient_id,
                "risk_type": record.risk_type,
                "risk_score": record.risk_score,
                "model_version": record.model_version,
                "prediction_proof": record.prediction_proof,
                "blockchain_tx_hash": record.blockchain_tx_hash,
                "timestamp": record.timestamp
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error assessing genetic risk: {str(e)}")

@router.post("/reproducibility/register", response_model=Dict)
async def register_experiment(request: ReproducibilityRequest):
    """Register experiment for reproducibility checking"""
    try:
        record = dashboard.reproducibility_registry.register_experiment(
            request.experiment_id,
            request.lab_id,
            request.raw_data,
            request.normalized_results
        )
        return {
            "status": "success",
            "message": "Experiment registered for reproducibility checking",
            "record": {
                "experiment_id": record.experiment_id,
                "lab_id": record.lab_id,
                "raw_data_hash": record.raw_data_hash,
                "normalized_results_hash": record.normalized_results_hash,
                "consistency_score": record.consistency_score,
                "blockchain_tx_hash": record.blockchain_tx_hash,
                "timestamp": record.timestamp
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering experiment: {str(e)}")

@router.get("/reproducibility/check/{experiment_id}")
async def check_reproducibility(experiment_id: str):
    """Check reproducibility across labs for an experiment"""
    try:
        records = dashboard.reproducibility_registry.check_reproducibility(experiment_id)
        return {
            "status": "success",
            "experiment_id": experiment_id,
            "records": [
                {
                    "lab_id": record.lab_id,
                    "raw_data_hash": record.raw_data_hash,
                    "normalized_results_hash": record.normalized_results_hash,
                    "consistency_score": record.consistency_score,
                    "blockchain_tx_hash": record.blockchain_tx_hash,
                    "timestamp": record.timestamp
                }
                for record in records
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking reproducibility: {str(e)}")

@router.post("/drug/response", response_model=Dict)
async def log_drug_response(request: DrugResponseRequest):
    """Log drug response prediction on blockchain"""
    try:
        record = dashboard.drug_response_ledger.log_drug_response(
            request.patient_id,
            request.drug_name,
            request.gene_markers,
            request.response_prediction
        )
        return {
            "status": "success",
            "message": "Drug response logged on blockchain",
            "record": {
                "patient_id": record.patient_id,
                "drug_name": record.drug_name,
                "gene_markers": record.gene_markers,
                "response_prediction": record.response_prediction,
                "confidence_score": record.confidence_score,
                "blockchain_tx_hash": record.blockchain_tx_hash,
                "timestamp": record.timestamp
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error logging drug response: {str(e)}")

@router.post("/demo/all")
async def demo_all_features():
    """Demonstrate all blockchain features"""
    try:
        dashboard.demo_all_features()
        return {
            "status": "success",
            "message": "All GeneChain blockchain features demonstrated successfully",
            "stats": dashboard.get_dashboard_stats()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error running demo: {str(e)}")

@router.get("/ledger/expression")
async def get_expression_ledger():
    """Get all gene expression records"""
    try:
        return {
            "status": "success",
            "records": [
                {
                    "dataset_name": record.dataset_name,
                    "analysis_type": record.analysis_type,
                    "model_version": record.model_version,
                    "results_hash": record.results_hash,
                    "researcher_id": record.researcher_id,
                    "blockchain_tx_hash": record.blockchain_tx_hash,
                    "timestamp": record.timestamp
                }
                for record in dashboard.blockchain.gene_expression_ledger
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting expression ledger: {str(e)}")

@router.get("/ledger/variants")
async def get_variant_ledger():
    """Get all variant conflict records"""
    try:
        return {
            "status": "success",
            "records": [
                {
                    "variant_id": record.variant_id,
                    "original_classification": record.original_classification,
                    "conflicting_classification": record.conflicting_classification,
                    "lab_id": record.lab_id,
                    "evidence_level": record.evidence_level,
                    "resolution_status": record.resolution_status,
                    "blockchain_tx_hash": record.blockchain_tx_hash,
                    "timestamp": record.timestamp
                }
                for record in dashboard.blockchain.variant_conflict_ledger
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting variant ledger: {str(e)}")

@router.get("/ledger/consent")
async def get_consent_ledger():
    """Get all consent records"""
    try:
        return {
            "status": "success",
            "records": [
                {
                    "patient_id": record.patient_id,
                    "dataset_type": record.dataset_type,
                    "consent_granted": record.consent_granted,
                    "consent_hash": record.consent_hash,
                    "researcher_id": record.researcher_id,
                    "smart_contract_address": record.smart_contract_address,
                    "timestamp": record.timestamp
                }
                for record in dashboard.blockchain.consent_ledger
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting consent ledger: {str(e)}")
