#!/usr/bin/env python3
"""
GeneChain Blockchain Enhancements
- Immutable Gene Expression Audit Trail
- Genetic Variant Conflict Resolution Ledger
- Promoter Integrity & Regulatory Checkpoints
- Consent-Based Data Sharing (Smart Contracts)
- AI-Backed Genetic Risk Dashboard (on-chain)
- Cross-Lab Gene Reproducibility Registry
- Drug Response Ledger
"""

import hashlib
import json
import time
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import pandas as pd
from web3 import Web3
from eth_account import Account
import ipfshttpclient

@dataclass
class GeneExpressionRecord:
    """Immutable gene expression analysis record"""
    dataset_name: str
    analysis_type: str
    model_version: str
    results_hash: str
    timestamp: str
    researcher_id: str
    blockchain_tx_hash: Optional[str] = None

@dataclass
class VariantConflictRecord:
    """Genetic variant conflict resolution record"""
    variant_id: str
    original_classification: str
    conflicting_classification: str
    lab_id: str
    evidence_level: str
    timestamp: str
    resolution_status: str
    blockchain_tx_hash: Optional[str] = None

@dataclass
class PromoterIntegrityRecord:
    """Promoter integrity validation record"""
    sequence_hash: str
    promoter_prediction: bool
    confidence_score: float
    regulatory_checkpoint: str
    validator_id: str
    timestamp: str
    blockchain_tx_hash: Optional[str] = None

@dataclass
class ConsentRecord:
    """Patient consent management record"""
    patient_id: str
    dataset_type: str
    consent_granted: bool
    consent_hash: str
    researcher_id: str
    timestamp: str
    smart_contract_address: Optional[str] = None

@dataclass
class GeneticRiskRecord:
    """AI-backed genetic risk assessment record"""
    patient_id: str
    risk_type: str
    risk_score: float
    model_version: str
    prediction_proof: str
    timestamp: str
    blockchain_tx_hash: Optional[str] = None

@dataclass
class ReproducibilityRecord:
    """Cross-lab gene reproducibility record"""
    experiment_id: str
    lab_id: str
    raw_data_hash: str
    normalized_results_hash: str
    consistency_score: float
    timestamp: str
    blockchain_tx_hash: Optional[str] = None

@dataclass
class DrugResponseRecord:
    """Drug response pharmacogenomics record"""
    patient_id: str
    drug_name: str
    gene_markers: List[str]
    response_prediction: str
    confidence_score: float
    timestamp: str
    blockchain_tx_hash: Optional[str] = None

class GeneChainBlockchain:
    """Main blockchain integration class for GeneChain"""
    
    def __init__(self, web3_provider: str = None, ipfs_client: str = None):
        self.web3 = Web3(Web3.HTTPProvider(web3_provider)) if web3_provider else None
        self.ipfs_client = ipfshttpclient.connect(ipfs_client) if ipfs_client else None
        self.account = Account.create()
        
        # In-memory storage for demo (replace with actual blockchain)
        self.gene_expression_ledger = []
        self.variant_conflict_ledger = []
        self.promoter_integrity_ledger = []
        self.consent_ledger = []
        self.genetic_risk_ledger = []
        self.reproducibility_ledger = []
        self.drug_response_ledger = []
    
    def _generate_hash(self, data: Any) -> str:
        """Generate SHA-256 hash of data"""
        if isinstance(data, (dict, list)):
            data_str = json.dumps(data, sort_keys=True)
        else:
            data_str = str(data)
        return hashlib.sha256(data_str.encode()).hexdigest()
    
    def _store_on_blockchain(self, data: Dict, record_type: str) -> str:
        """Store data on blockchain (simulated for demo)"""
        # In production, this would interact with actual blockchain
        tx_hash = self._generate_hash(f"{record_type}_{time.time()}_{data}")
        
        # Simulate blockchain transaction
        print(f"🔗 Storing {record_type} on blockchain: {tx_hash}")
        return tx_hash
    
    def _store_on_ipfs(self, data: Dict) -> str:
        """Store data on IPFS (simulated for demo)"""
        if self.ipfs_client:
            # In production, this would store on actual IPFS
            data_str = json.dumps(data)
            ipfs_hash = self._generate_hash(data_str)
            print(f"📁 Storing on IPFS: {ipfs_hash}")
            return ipfs_hash
        return self._generate_hash(json.dumps(data))

class GeneExpressionAuditTrail:
    """Immutable Gene Expression Audit Trail"""
    
    def __init__(self, blockchain: GeneChainBlockchain):
        self.blockchain = blockchain
    
    def log_expression_analysis(self, dataset_name: str, analysis_type: str, 
                               model_version: str, results: Dict, researcher_id: str) -> GeneExpressionRecord:
        """Log gene expression analysis results on blockchain"""
        
        # Generate results hash
        results_hash = self.blockchain._generate_hash(results)
        
        # Create record
        record = GeneExpressionRecord(
            dataset_name=dataset_name,
            analysis_type=analysis_type,
            model_version=model_version,
            results_hash=results_hash,
            timestamp=datetime.now().isoformat(),
            researcher_id=researcher_id
        )
        
        # Store on blockchain
        tx_hash = self.blockchain._store_on_blockchain(asdict(record), "gene_expression")
        record.blockchain_tx_hash = tx_hash
        
        # Store in ledger
        self.blockchain.gene_expression_ledger.append(record)
        
        print(f"🧬 Logged gene expression analysis: {analysis_type} on {dataset_name}")
        return record
    
    def verify_expression_integrity(self, record: GeneExpressionRecord, results: Dict) -> bool:
        """Verify that results haven't been tampered with"""
        current_hash = self.blockchain._generate_hash(results)
        return current_hash == record.results_hash

class VariantConflictResolver:
    """Genetic Variant Conflict Resolution Ledger"""
    
    def __init__(self, blockchain: GeneChainBlockchain):
        self.blockchain = blockchain
    
    def log_variant_conflict(self, variant_id: str, original_classification: str,
                           conflicting_classification: str, lab_id: str, 
                           evidence_level: str) -> VariantConflictRecord:
        """Log variant classification conflict on blockchain"""
        
        record = VariantConflictRecord(
            variant_id=variant_id,
            original_classification=original_classification,
            conflicting_classification=conflicting_classification,
            lab_id=lab_id,
            evidence_level=evidence_level,
            timestamp=datetime.now().isoformat(),
            resolution_status="pending"
        )
        
        # Store on blockchain
        tx_hash = self.blockchain._store_on_blockchain(asdict(record), "variant_conflict")
        record.blockchain_tx_hash = tx_hash
        
        # Store in ledger
        self.blockchain.variant_conflict_ledger.append(record)
        
        print(f"⚖️ Logged variant conflict: {variant_id} - {original_classification} vs {conflicting_classification}")
        return record
    
    def resolve_conflict(self, record: VariantConflictRecord, resolution: str) -> None:
        """Resolve variant conflict"""
        record.resolution_status = resolution
        print(f"✅ Resolved variant conflict: {record.variant_id} -> {resolution}")

class PromoterIntegrityValidator:
    """Promoter Integrity & Regulatory Checkpoints"""
    
    def __init__(self, blockchain: GeneChainBlockchain):
        self.blockchain = blockchain
    
    def validate_promoter_sequence(self, sequence: str, validator_id: str) -> PromoterIntegrityRecord:
        """Validate promoter sequence and store on blockchain"""
        
        # Generate sequence hash
        sequence_hash = self.blockchain._generate_hash(sequence)
        
        # Simulate ML prediction (replace with actual model)
        import random
        promoter_prediction = random.choice([True, False])
        confidence_score = random.uniform(0.7, 0.95)
        
        record = PromoterIntegrityRecord(
            sequence_hash=sequence_hash,
            promoter_prediction=promoter_prediction,
            confidence_score=confidence_score,
            regulatory_checkpoint="ML_Validation",
            validator_id=validator_id,
            timestamp=datetime.now().isoformat()
        )
        
        # Store on blockchain
        tx_hash = self.blockchain._store_on_blockchain(asdict(record), "promoter_integrity")
        record.blockchain_tx_hash = tx_hash
        
        # Store in ledger
        self.blockchain.promoter_integrity_ledger.append(record)
        
        print(f"🔐 Validated promoter sequence: {sequence_hash[:8]}... -> {promoter_prediction}")
        return record

class ConsentManager:
    """Consent-Based Data Sharing (Smart Contracts)"""
    
    def __init__(self, blockchain: GeneChainBlockchain):
        self.blockchain = blockchain
    
    def create_consent_record(self, patient_id: str, dataset_type: str, 
                            consent_granted: bool, researcher_id: str) -> ConsentRecord:
        """Create patient consent record"""
        
        # Generate consent hash
        consent_data = {
            "patient_id": patient_id,
            "dataset_type": dataset_type,
            "consent_granted": consent_granted,
            "timestamp": datetime.now().isoformat()
        }
        consent_hash = self.blockchain._generate_hash(consent_data)
        
        record = ConsentRecord(
            patient_id=patient_id,
            dataset_type=dataset_type,
            consent_granted=consent_granted,
            consent_hash=consent_hash,
            researcher_id=researcher_id,
            timestamp=datetime.now().isoformat()
        )
        
        # Store on blockchain
        tx_hash = self.blockchain._store_on_blockchain(asdict(record), "consent")
        record.smart_contract_address = tx_hash
        
        # Store in ledger
        self.blockchain.consent_ledger.append(record)
        
        print(f"📋 Created consent record: {patient_id} for {dataset_type}")
        return record
    
    def verify_consent(self, patient_id: str, dataset_type: str) -> bool:
        """Verify patient consent for data access"""
        for record in self.blockchain.consent_ledger:
            if (record.patient_id == patient_id and 
                record.dataset_type == dataset_type and 
                record.consent_granted):
                return True
        return False

class GeneticRiskDashboard:
    """AI-Backed Genetic Risk Dashboard (on-chain)"""
    
    def __init__(self, blockchain: GeneChainBlockchain):
        self.blockchain = blockchain
    
    def assess_genetic_risk(self, patient_id: str, risk_type: str, 
                          patient_data: Dict, model_version: str) -> GeneticRiskRecord:
        """Assess genetic risk and store on blockchain"""
        
        # Simulate AI risk assessment (replace with actual model)
        import random
        risk_score = random.uniform(0.1, 0.9)
        
        # Generate prediction proof
        prediction_proof = self.blockchain._generate_hash({
            "patient_data": patient_data,
            "model_version": model_version,
            "risk_score": risk_score
        })
        
        record = GeneticRiskRecord(
            patient_id=patient_id,
            risk_type=risk_type,
            risk_score=risk_score,
            model_version=model_version,
            prediction_proof=prediction_proof,
            timestamp=datetime.now().isoformat()
        )
        
        # Store on blockchain
        tx_hash = self.blockchain._store_on_blockchain(asdict(record), "genetic_risk")
        record.blockchain_tx_hash = tx_hash
        
        # Store in ledger
        self.blockchain.genetic_risk_ledger.append(record)
        
        print(f"🧬 Assessed genetic risk: {patient_id} - {risk_type} = {risk_score:.2f}")
        return record

class ReproducibilityRegistry:
    """Cross-Lab Gene Reproducibility Registry"""
    
    def __init__(self, blockchain: GeneChainBlockchain):
        self.blockchain = blockchain
    
    def register_experiment(self, experiment_id: str, lab_id: str, 
                          raw_data: Dict, normalized_results: Dict) -> ReproducibilityRecord:
        """Register experiment results for reproducibility checking"""
        
        # Generate hashes
        raw_data_hash = self.blockchain._generate_hash(raw_data)
        normalized_results_hash = self.blockchain._generate_hash(normalized_results)
        
        # Calculate consistency score (simulated)
        import random
        consistency_score = random.uniform(0.8, 1.0)
        
        record = ReproducibilityRecord(
            experiment_id=experiment_id,
            lab_id=lab_id,
            raw_data_hash=raw_data_hash,
            normalized_results_hash=normalized_results_hash,
            consistency_score=consistency_score,
            timestamp=datetime.now().isoformat()
        )
        
        # Store on blockchain
        tx_hash = self.blockchain._store_on_blockchain(asdict(record), "reproducibility")
        record.blockchain_tx_hash = tx_hash
        
        # Store in ledger
        self.blockchain.reproducibility_ledger.append(record)
        
        print(f"🔬 Registered experiment: {experiment_id} from {lab_id}")
        return record
    
    def check_reproducibility(self, experiment_id: str) -> List[ReproducibilityRecord]:
        """Check reproducibility across labs"""
        return [r for r in self.blockchain.reproducibility_ledger if r.experiment_id == experiment_id]

class DrugResponseLedger:
    """Drug Response Ledger"""
    
    def __init__(self, blockchain: GeneChainBlockchain):
        self.blockchain = blockchain
    
    def log_drug_response(self, patient_id: str, drug_name: str, 
                         gene_markers: List[str], response_prediction: str) -> DrugResponseRecord:
        """Log drug response prediction on blockchain"""
        
        # Simulate confidence score
        import random
        confidence_score = random.uniform(0.6, 0.95)
        
        record = DrugResponseRecord(
            patient_id=patient_id,
            drug_name=drug_name,
            gene_markers=gene_markers,
            response_prediction=response_prediction,
            confidence_score=confidence_score,
            timestamp=datetime.now().isoformat()
        )
        
        # Store on blockchain
        tx_hash = self.blockchain._store_on_blockchain(asdict(record), "drug_response")
        record.blockchain_tx_hash = tx_hash
        
        # Store in ledger
        self.blockchain.drug_response_ledger.append(record)
        
        print(f"💊 Logged drug response: {patient_id} - {drug_name} -> {response_prediction}")
        return record

class GenomicBlockchainDashboard:
    """Main dashboard for all genomic blockchain features"""
    
    def __init__(self):
        self.blockchain = GeneChainBlockchain()
        self.expression_audit = GeneExpressionAuditTrail(self.blockchain)
        self.variant_resolver = VariantConflictResolver(self.blockchain)
        self.promoter_validator = PromoterIntegrityValidator(self.blockchain)
        self.consent_manager = ConsentManager(self.blockchain)
        self.risk_dashboard = GeneticRiskDashboard(self.blockchain)
        self.reproducibility_registry = ReproducibilityRegistry(self.blockchain)
        self.drug_response_ledger = DrugResponseLedger(self.blockchain)
    
    def get_dashboard_stats(self) -> Dict:
        """Get dashboard statistics"""
        return {
            "gene_expression_records": len(self.blockchain.gene_expression_ledger),
            "variant_conflicts": len(self.blockchain.variant_conflict_ledger),
            "promoter_validations": len(self.blockchain.promoter_integrity_ledger),
            "consent_records": len(self.blockchain.consent_ledger),
            "genetic_risk_assessments": len(self.blockchain.genetic_risk_ledger),
            "reproducibility_experiments": len(self.blockchain.reproducibility_ledger),
            "drug_response_records": len(self.blockchain.drug_response_ledger)
        }
    
    def demo_all_features(self):
        """Demonstrate all blockchain features"""
        print("🧬 GeneChain Blockchain Features Demo")
        print("=" * 50)
        
        # 1. Gene Expression Audit Trail
        print("\n1. 🧬 Gene Expression Audit Trail")
        self.expression_audit.log_expression_analysis(
            "ALL_AML_train.csv", "leukemia_subtype_prediction", 
            "v2.1.0", {"accuracy": 0.95, "predictions": [1, 0, 1]}, "researcher_001"
        )
        
        # 2. Variant Conflict Resolution
        print("\n2. ⚖️ Variant Conflict Resolution")
        self.variant_resolver.log_variant_conflict(
            "rs123456", "benign", "pathogenic", "lab_001", "strong"
        )
        
        # 3. Promoter Integrity Validation
        print("\n3. 🔐 Promoter Integrity Validation")
        self.promoter_validator.validate_promoter_sequence(
            "ATCGATCGATCG", "validator_001"
        )
        
        # 4. Consent Management
        print("\n4. 📋 Consent Management")
        self.consent_manager.create_consent_record(
            "patient_001", "AML_expression", True, "researcher_001"
        )
        
        # 5. Genetic Risk Assessment
        print("\n5. 🧬 Genetic Risk Assessment")
        self.risk_dashboard.assess_genetic_risk(
            "patient_001", "AML_risk", {"age": 45, "genes": ["FLT3", "NPM1"]}, "v1.0"
        )
        
        # 6. Reproducibility Registry
        print("\n6. 🔬 Reproducibility Registry")
        self.reproducibility_registry.register_experiment(
            "exp_001", "lab_001", {"raw_data": "..."}, {"normalized": "..."}
        )
        
        # 7. Drug Response Ledger
        print("\n7. 💊 Drug Response Ledger")
        self.drug_response_ledger.log_drug_response(
            "patient_001", "Cytarabine", ["FLT3", "NPM1"], "responsive"
        )
        
        # Dashboard Stats
        print("\n📊 Dashboard Statistics")
        print("=" * 30)
        stats = self.get_dashboard_stats()
        for key, value in stats.items():
            print(f"{key.replace('_', ' ').title()}: {value}")

if __name__ == "__main__":
    # Run demo
    dashboard = GenomicBlockchainDashboard()
    dashboard.demo_all_features()
