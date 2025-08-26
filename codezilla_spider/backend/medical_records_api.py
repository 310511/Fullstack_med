#!/usr/bin/env python3
"""
Medical Records API
- Patient management
- Medical records CRUD operations
- Prescription management
- Lab results tracking
- Appointment scheduling
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
import uuid
import json
import os
from enum import Enum

app = FastAPI(
    title="Medical Records API",
    description="Comprehensive medical records management system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:3006"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class BloodType(str, Enum):
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"

class RecordType(str, Enum):
    CONSULTATION = "consultation"
    LAB = "lab"
    PRESCRIPTION = "prescription"
    PROCEDURE = "procedure"
    VACCINATION = "vaccination"

class RecordStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PENDING = "pending"
    CANCELLED = "cancelled"

class PrescriptionStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    DISCONTINUED = "discontinued"
    EXPIRED = "expired"

class LabResultStatus(str, Enum):
    NORMAL = "normal"
    HIGH = "high"
    LOW = "low"
    CRITICAL = "critical"

class AppointmentStatus(str, Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no-show"

# Pydantic models
class ContactInfo(BaseModel):
    phone: str
    email: str
    address: str

class EmergencyContact(BaseModel):
    name: str
    phone: str
    relationship: str

class Insurance(BaseModel):
    provider: str
    policy_number: str
    group_number: str
    expiry_date: date

class Patient(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    date_of_birth: date
    gender: Gender
    blood_type: BloodType
    height: Optional[str] = None
    weight: Optional[str] = None
    contact: ContactInfo
    emergency_contact: EmergencyContact
    insurance: Insurance
    allergies: List[str] = []
    conditions: List[str] = []
    medications: List[str] = []
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class MedicalRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    date: date
    type: RecordType
    title: str
    description: str
    doctor: str
    status: RecordStatus
    attachments: Optional[List[str]] = []
    tags: List[str] = []
    created_at: datetime = Field(default_factory=datetime.now)

class Prescription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    medication: str
    dosage: str
    frequency: str
    duration: str
    prescribed_by: str
    prescribed_date: date
    status: PrescriptionStatus
    refills: int
    refills_remaining: int
    instructions: str
    side_effects: List[str] = []
    interactions: List[str] = []
    created_at: datetime = Field(default_factory=datetime.now)

class LabResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    date: date
    test_name: str
    result: str
    unit: str
    reference_range: str
    status: LabResultStatus
    lab: str
    ordered_by: str
    created_at: datetime = Field(default_factory=datetime.now)

class Appointment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_id: str
    date: date
    time: str
    type: str
    doctor: str
    status: AppointmentStatus
    notes: str
    location: str
    created_at: datetime = Field(default_factory=datetime.now)

# In-memory storage (replace with database in production)
patients_db: Dict[str, Patient] = {}
medical_records_db: Dict[str, MedicalRecord] = {}
prescriptions_db: Dict[str, Prescription] = {}
lab_results_db: Dict[str, LabResult] = {}
appointments_db: Dict[str, Appointment] = {}

# Helper functions
def get_patient(patient_id: str) -> Patient:
    if patient_id not in patients_db:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patients_db[patient_id]

def save_data():
    """Save data to JSON files (for persistence)"""
    data = {
        "patients": {k: v.dict() for k, v in patients_db.items()},
        "medical_records": {k: v.dict() for k, v in medical_records_db.items()},
        "prescriptions": {k: v.dict() for k, v in prescriptions_db.items()},
        "lab_results": {k: v.dict() for k, v in lab_results_db.items()},
        "appointments": {k: v.dict() for k, v in appointments_db.items()}
    }
    
    os.makedirs("data", exist_ok=True)
    with open("data/medical_records.json", "w") as f:
        json.dump(data, f, indent=2, default=str)

def load_data():
    """Load data from JSON files"""
    try:
        with open("data/medical_records.json", "r") as f:
            data = json.load(f)
            
        for k, v in data.get("patients", {}).items():
            patients_db[k] = Patient(**v)
        for k, v in data.get("medical_records", {}).items():
            medical_records_db[k] = MedicalRecord(**v)
        for k, v in data.get("prescriptions", {}).items():
            prescriptions_db[k] = Prescription(**v)
        for k, v in data.get("lab_results", {}).items():
            lab_results_db[k] = LabResult(**v)
        for k, v in data.get("appointments", {}).items():
            appointments_db[k] = Appointment(**v)
    except FileNotFoundError:
        # Initialize with sample data
        initialize_sample_data()

def initialize_sample_data():
    """Initialize with sample data"""
    # Sample patient
    sample_patient = Patient(
        id="1",
        name="John Doe",
        date_of_birth=date(1985, 3, 15),
        gender=Gender.MALE,
        blood_type=BloodType.O_POSITIVE,
        height="175 cm",
        weight="70 kg",
        contact=ContactInfo(
            phone="+1-555-0123",
            email="john.doe@email.com",
            address="123 Main St, City, State 12345"
        ),
        emergency_contact=EmergencyContact(
            name="Jane Doe",
            phone="+1-555-0124",
            relationship="Spouse"
        ),
        insurance=Insurance(
            provider="Blue Cross Blue Shield",
            policy_number="BCBS123456",
            group_number="GRP789",
            expiry_date=date(2024, 12, 31)
        ),
        allergies=["Penicillin", "Peanuts", "Shellfish"],
        conditions=["Hypertension", "Type 2 Diabetes"],
        medications=["Lisinopril", "Metformin", "Aspirin"]
    )
    patients_db["1"] = sample_patient

# Load data on startup
load_data()

# API Endpoints

@app.get("/")
async def root():
    return {"message": "Medical Records API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "data_counts": {
            "patients": len(patients_db),
            "medical_records": len(medical_records_db),
            "prescriptions": len(prescriptions_db),
            "lab_results": len(lab_results_db),
            "appointments": len(appointments_db)
        }
    }

# Patient endpoints
@app.get("/api/patients", response_model=List[Patient])
async def get_patients():
    """Get all patients"""
    return list(patients_db.values())

@app.get("/api/patients/{patient_id}", response_model=Patient)
async def get_patient_by_id(patient_id: str):
    """Get patient by ID"""
    return get_patient(patient_id)

@app.post("/api/patients", response_model=Patient)
async def create_patient(patient: Patient):
    """Create a new patient"""
    if patient.id in patients_db:
        raise HTTPException(status_code=400, detail="Patient ID already exists")
    
    patients_db[patient.id] = patient
    save_data()
    return patient

@app.put("/api/patients/{patient_id}", response_model=Patient)
async def update_patient(patient_id: str, patient: Patient):
    """Update patient information"""
    if patient_id not in patients_db:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    patient.id = patient_id
    patient.updated_at = datetime.now()
    patients_db[patient_id] = patient
    save_data()
    return patient

@app.delete("/api/patients/{patient_id}")
async def delete_patient(patient_id: str):
    """Delete a patient"""
    if patient_id not in patients_db:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    del patients_db[patient_id]
    save_data()
    return {"message": "Patient deleted successfully"}

# Medical records endpoints
@app.get("/api/patients/{patient_id}/records", response_model=List[MedicalRecord])
async def get_patient_records(patient_id: str):
    """Get medical records for a patient"""
    get_patient(patient_id)  # Verify patient exists
    return [record for record in medical_records_db.values() if record.patient_id == patient_id]

@app.post("/api/patients/{patient_id}/records", response_model=MedicalRecord)
async def create_medical_record(patient_id: str, record: MedicalRecord):
    """Create a new medical record"""
    get_patient(patient_id)  # Verify patient exists
    record.patient_id = patient_id
    medical_records_db[record.id] = record
    save_data()
    return record

@app.get("/api/records/{record_id}", response_model=MedicalRecord)
async def get_medical_record(record_id: str):
    """Get medical record by ID"""
    if record_id not in medical_records_db:
        raise HTTPException(status_code=404, detail="Medical record not found")
    return medical_records_db[record_id]

@app.put("/api/records/{record_id}", response_model=MedicalRecord)
async def update_medical_record(record_id: str, record: MedicalRecord):
    """Update medical record"""
    if record_id not in medical_records_db:
        raise HTTPException(status_code=404, detail="Medical record not found")
    
    record.id = record_id
    medical_records_db[record_id] = record
    save_data()
    return record

@app.delete("/api/records/{record_id}")
async def delete_medical_record(record_id: str):
    """Delete medical record"""
    if record_id not in medical_records_db:
        raise HTTPException(status_code=404, detail="Medical record not found")
    
    del medical_records_db[record_id]
    save_data()
    return {"message": "Medical record deleted successfully"}

# Prescription endpoints
@app.get("/api/patients/{patient_id}/prescriptions", response_model=List[Prescription])
async def get_patient_prescriptions(patient_id: str):
    """Get prescriptions for a patient"""
    get_patient(patient_id)  # Verify patient exists
    return [prescription for prescription in prescriptions_db.values() if prescription.patient_id == patient_id]

@app.post("/api/patients/{patient_id}/prescriptions", response_model=Prescription)
async def create_prescription(patient_id: str, prescription: Prescription):
    """Create a new prescription"""
    get_patient(patient_id)  # Verify patient exists
    prescription.patient_id = patient_id
    prescriptions_db[prescription.id] = prescription
    save_data()
    return prescription

@app.get("/api/prescriptions/{prescription_id}", response_model=Prescription)
async def get_prescription(prescription_id: str):
    """Get prescription by ID"""
    if prescription_id not in prescriptions_db:
        raise HTTPException(status_code=404, detail="Prescription not found")
    return prescriptions_db[prescription_id]

@app.put("/api/prescriptions/{prescription_id}", response_model=Prescription)
async def update_prescription(prescription_id: str, prescription: Prescription):
    """Update prescription"""
    if prescription_id not in prescriptions_db:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    prescription.id = prescription_id
    prescriptions_db[prescription_id] = prescription
    save_data()
    return prescription

@app.delete("/api/prescriptions/{prescription_id}")
async def delete_prescription(prescription_id: str):
    """Delete prescription"""
    if prescription_id not in prescriptions_db:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    del prescriptions_db[prescription_id]
    save_data()
    return {"message": "Prescription deleted successfully"}

# Lab results endpoints
@app.get("/api/patients/{patient_id}/lab-results", response_model=List[LabResult])
async def get_patient_lab_results(patient_id: str):
    """Get lab results for a patient"""
    get_patient(patient_id)  # Verify patient exists
    return [result for result in lab_results_db.values() if result.patient_id == patient_id]

@app.post("/api/patients/{patient_id}/lab-results", response_model=LabResult)
async def create_lab_result(patient_id: str, lab_result: LabResult):
    """Create a new lab result"""
    get_patient(patient_id)  # Verify patient exists
    lab_result.patient_id = patient_id
    lab_results_db[lab_result.id] = lab_result
    save_data()
    return lab_result

@app.get("/api/lab-results/{result_id}", response_model=LabResult)
async def get_lab_result(result_id: str):
    """Get lab result by ID"""
    if result_id not in lab_results_db:
        raise HTTPException(status_code=404, detail="Lab result not found")
    return lab_results_db[result_id]

# Appointment endpoints
@app.get("/api/patients/{patient_id}/appointments", response_model=List[Appointment])
async def get_patient_appointments(patient_id: str):
    """Get appointments for a patient"""
    get_patient(patient_id)  # Verify patient exists
    return [appointment for appointment in appointments_db.values() if appointment.patient_id == patient_id]

@app.post("/api/patients/{patient_id}/appointments", response_model=Appointment)
async def create_appointment(patient_id: str, appointment: Appointment):
    """Create a new appointment"""
    get_patient(patient_id)  # Verify patient exists
    appointment.patient_id = patient_id
    appointments_db[appointment.id] = appointment
    save_data()
    return appointment

@app.get("/api/appointments/{appointment_id}", response_model=Appointment)
async def get_appointment(appointment_id: str):
    """Get appointment by ID"""
    if appointment_id not in appointments_db:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointments_db[appointment_id]

@app.put("/api/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(appointment_id: str, appointment: Appointment):
    """Update appointment"""
    if appointment_id not in appointments_db:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.id = appointment_id
    appointments_db[appointment_id] = appointment
    save_data()
    return appointment

@app.delete("/api/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str):
    """Delete appointment"""
    if appointment_id not in appointments_db:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    del appointments_db[appointment_id]
    save_data()
    return {"message": "Appointment deleted successfully"}

# Search and analytics endpoints
@app.get("/api/search/patients")
async def search_patients(q: str):
    """Search patients by name"""
    results = []
    query = q.lower()
    for patient in patients_db.values():
        if query in patient.name.lower():
            results.append(patient)
    return results

@app.get("/api/analytics/patient/{patient_id}")
async def get_patient_analytics(patient_id: str):
    """Get analytics for a patient"""
    get_patient(patient_id)  # Verify patient exists
    
    patient_records = [r for r in medical_records_db.values() if r.patient_id == patient_id]
    patient_prescriptions = [p for p in prescriptions_db.values() if p.patient_id == patient_id]
    patient_lab_results = [l for l in lab_results_db.values() if l.patient_id == patient_id]
    patient_appointments = [a for a in appointments_db.values() if a.patient_id == patient_id]
    
    return {
        "patient_id": patient_id,
        "total_records": len(patient_records),
        "active_prescriptions": len([p for p in patient_prescriptions if p.status == PrescriptionStatus.ACTIVE]),
        "total_lab_results": len(patient_lab_results),
        "upcoming_appointments": len([a for a in patient_appointments if a.status == AppointmentStatus.SCHEDULED]),
        "record_types": {record.type.value: len([r for r in patient_records if r.type == record.type]) for record in RecordType},
        "lab_status_counts": {status.value: len([l for l in patient_lab_results if l.status == status]) for status in LabResultStatus}
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5002)


