"""
Database API endpoints for MedChain
Provides REST API endpoints for database operations
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
import logging
from datetime import datetime

from database import (
    InventoryService,
    UserService,
    MedicineService,
    VoiceService,
    AlertService,
    CacheService,
    initialize_database,
    check_all_databases_health
)

# Initialize FastAPI app
app = FastAPI(title="MedChain Database API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database services
inventory_service = InventoryService()
user_service = UserService()
medicine_service = MedicineService()
voice_service = VoiceService()
alert_service = AlertService()
cache_service = CacheService()

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        initialize_database()
        logging.info("Database initialized successfully")
    except Exception as e:
        logging.error(f"Failed to initialize database: {e}")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Check database health"""
    health_status = check_all_databases_health()
    return {
        "status": "healthy" if all(health_status.values()) else "unhealthy",
        "databases": health_status,
        "timestamp": datetime.utcnow().isoformat()
    }

# Inventory endpoints
@app.get("/api/inventory/items")
async def get_inventory_items():
    """Get all inventory items"""
    try:
        items = inventory_service.get_all_items()
        return {"items": items, "count": len(items)}
    except Exception as e:
        logging.error(f"Error fetching inventory items: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch inventory items")

@app.get("/api/inventory/items/{item_id}")
async def get_inventory_item(item_id: str):
    """Get inventory item by ID"""
    try:
        item = inventory_service.get_item_by_id(item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return item
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching inventory item {item_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch inventory item")

@app.post("/api/inventory/items")
async def create_inventory_item(item_data: Dict):
    """Create a new inventory item"""
    try:
        required_fields = ['name', 'category']
        for field in required_fields:
            if field not in item_data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        item_id = inventory_service.create_item(item_data)
        if not item_id:
            raise HTTPException(status_code=500, detail="Failed to create inventory item")
        
        return {"id": item_id, "message": "Inventory item created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error creating inventory item: {e}")
        raise HTTPException(status_code=500, detail="Failed to create inventory item")

@app.put("/api/inventory/items/{item_id}")
async def update_inventory_item(item_id: str, updates: Dict):
    """Update an inventory item"""
    try:
        success = inventory_service.update_item(item_id, updates)
        if not success:
            raise HTTPException(status_code=404, detail="Item not found")
        
        return {"message": "Inventory item updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error updating inventory item {item_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to update inventory item")

@app.delete("/api/inventory/items/{item_id}")
async def delete_inventory_item(item_id: str):
    """Delete an inventory item"""
    try:
        success = inventory_service.delete_item(item_id)
        if not success:
            raise HTTPException(status_code=404, detail="Item not found")
        
        return {"message": "Inventory item deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting inventory item {item_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete inventory item")

@app.get("/api/inventory/low-stock")
async def get_low_stock_items():
    """Get items with low stock"""
    try:
        items = inventory_service.get_low_stock_items()
        return {"items": items, "count": len(items)}
    except Exception as e:
        logging.error(f"Error fetching low stock items: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch low stock items")

# User endpoints
@app.get("/api/users/{firebase_uid}")
async def get_user_by_firebase_uid(firebase_uid: str):
    """Get user by Firebase UID"""
    try:
        user = user_service.get_user_by_firebase_uid(firebase_uid)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching user by Firebase UID: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch user")

@app.post("/api/users")
async def create_user(user_data: Dict):
    """Create a new user"""
    try:
        required_fields = ['firebase_uid', 'email']
        for field in required_fields:
            if field not in user_data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        user_id = user_service.create_user(user_data)
        if not user_id:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        return {"id": user_id, "message": "User created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error creating user: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user")

# Medicine endpoints
@app.get("/api/medicine/recommendations")
async def get_medicine_recommendations(symptoms: str):
    """Get medicine recommendations by symptoms"""
    try:
        symptoms_list = [s.strip() for s in symptoms.split(',')]
        recommendations = medicine_service.get_recommendations_by_symptoms(symptoms_list)
        return {"recommendations": recommendations, "count": len(recommendations)}
    except Exception as e:
        logging.error(f"Error fetching medicine recommendations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch medicine recommendations")

@app.get("/api/medicine/knowledge/{medicine_name}")
async def get_medicine_knowledge(medicine_name: str):
    """Get medicine knowledge from MongoDB"""
    try:
        knowledge = medicine_service.get_medicine_knowledge(medicine_name)
        if not knowledge:
            raise HTTPException(status_code=404, detail="Medicine not found")
        return knowledge
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching medicine knowledge for {medicine_name}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch medicine knowledge")

# Voice endpoints
@app.post("/api/voice/interactions")
async def save_voice_interaction(interaction_data: Dict):
    """Save voice interaction"""
    try:
        required_fields = ['user_id', 'transcript']
        for field in required_fields:
            if field not in interaction_data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        interaction_id = voice_service.save_voice_interaction(interaction_data)
        if not interaction_id:
            raise HTTPException(status_code=500, detail="Failed to save voice interaction")
        
        return {"id": interaction_id, "message": "Voice interaction saved successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error saving voice interaction: {e}")
        raise HTTPException(status_code=500, detail="Failed to save voice interaction")

@app.get("/api/voice/interactions/{user_id}")
async def get_user_interactions(user_id: str, limit: int = 50):
    """Get user's voice interactions"""
    try:
        interactions = voice_service.get_user_interactions(user_id, limit)
        return {"interactions": interactions, "count": len(interactions)}
    except Exception as e:
        logging.error(f"Error fetching user interactions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch user interactions")

# Alert endpoints
@app.get("/api/alerts/{user_id}")
async def get_user_alerts(user_id: str, unread_only: bool = False):
    """Get user's alerts"""
    try:
        alerts = alert_service.get_user_alerts(user_id, unread_only)
        return {"alerts": alerts, "count": len(alerts)}
    except Exception as e:
        logging.error(f"Error fetching user alerts: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch user alerts")

@app.post("/api/alerts")
async def create_alert(alert_data: Dict):
    """Create a new alert"""
    try:
        required_fields = ['user_id', 'alert_type', 'title', 'message']
        for field in required_fields:
            if field not in alert_data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        alert_id = alert_service.create_alert(alert_data)
        if not alert_id:
            raise HTTPException(status_code=500, detail="Failed to create alert")
        
        return {"id": alert_id, "message": "Alert created successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error creating alert: {e}")
        raise HTTPException(status_code=500, detail="Failed to create alert")

@app.put("/api/alerts/{alert_id}/read")
async def mark_alert_read(alert_id: str):
    """Mark alert as read"""
    try:
        success = alert_service.mark_alert_read(alert_id)
        if not success:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {"message": "Alert marked as read"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error marking alert as read: {e}")
        raise HTTPException(status_code=500, detail="Failed to mark alert as read")

# Cache endpoints
@app.get("/api/cache/{key}")
async def get_cache_value(key: str):
    """Get cache value"""
    try:
        value = cache_service.get_cache(key)
        if value is None:
            raise HTTPException(status_code=404, detail="Cache key not found")
        return {"key": key, "value": value}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting cache value for key {key}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get cache value")

@app.post("/api/cache")
async def set_cache_value(key: str, value: Dict, expire_seconds: int = 3600):
    """Set cache value"""
    try:
        success = cache_service.set_cache(key, value, expire_seconds)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to set cache value")
        
        return {"message": "Cache value set successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error setting cache value for key {key}: {e}")
        raise HTTPException(status_code=500, detail="Failed to set cache value")

@app.delete("/api/cache/{key}")
async def delete_cache_value(key: str):
    """Delete cache value"""
    try:
        success = cache_service.delete_cache(key)
        if not success:
            raise HTTPException(status_code=404, detail="Cache key not found")
        
        return {"message": "Cache value deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error deleting cache value for key {key}: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete cache value")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)


