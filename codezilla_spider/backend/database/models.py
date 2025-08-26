"""
Database models for MedChain
Defines data structures and validation
"""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
import uuid

class User(BaseModel):
    """User model"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    firebase_uid: str
    email: str
    display_name: Optional[str] = None
    role: str = "user"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class InventoryItem(BaseModel):
    """Inventory item model"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    stock_quantity: int = 0
    threshold_quantity: int = 0
    expiry_date: Optional[str] = None
    supplier: Optional[str] = None
    price: Optional[float] = None
    status: str = "good"
    blockchain_verified: bool = False
    rfid_tag: Optional[str] = None
    barcode: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

class MedicineRecommendation(BaseModel):
    """Medicine recommendation model"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    disease_name: str
    symptoms: List[str]
    recommended_medicines: List[str]
    dosage_instructions: Optional[str] = None
    side_effects: Optional[List[str]] = None
    contraindications: Optional[List[str]] = None
    urgency_level: str = "medium"
    ai_confidence_score: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None

class VoiceInteraction(BaseModel):
    """Voice interaction model"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    transcript: str
    confidence_score: Optional[float] = None
    medicine_recommendation_id: Optional[str] = None
    interaction_type: str = "medicine_query"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Alert(BaseModel):
    """Alert model"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    alert_type: str
    title: str
    message: str
    severity: str = "medium"
    is_read: bool = False
    is_resolved: bool = False
    related_item_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

