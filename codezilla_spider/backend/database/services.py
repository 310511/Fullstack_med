"""
Database services for MedChain
Provides business logic for database operations
"""

import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
import json
import logging
from .connection import get_database_connection

logger = logging.getLogger(__name__)

class BaseService:
    """Base service class with common database operations"""
    
    def __init__(self):
        self.db = get_database_connection()
    
    def _generate_id(self) -> str:
        """Generate a UUID string"""
        return str(uuid.uuid4())

class InventoryService(BaseService):
    """Service for inventory management"""
    
    def get_all_items(self) -> List[Dict]:
        """Get all inventory items"""
        try:
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM inventory_items 
                    ORDER BY created_at DESC
                """)
                return cursor.fetchall()
        except Exception as e:
            logger.error(f"Error fetching inventory items: {e}")
            return []
    
    def get_item_by_id(self, item_id: str) -> Optional[Dict]:
        """Get inventory item by ID"""
        try:
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM inventory_items 
                    WHERE id = %s
                """, (item_id,))
                return cursor.fetchone()
        except Exception as e:
            logger.error(f"Error fetching inventory item {item_id}: {e}")
            return None
    
    def create_item(self, item_data: Dict) -> Optional[str]:
        """Create a new inventory item"""
        try:
            item_id = self._generate_id()
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    INSERT INTO inventory_items (
                        id, name, category, stock_quantity, threshold_quantity,
                        expiry_date, supplier, price, status, blockchain_verified,
                        rfid_tag, barcode, description, created_by
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    item_id, item_data['name'], item_data['category'],
                    item_data.get('stock_quantity', 0), item_data.get('threshold_quantity', 0),
                    item_data.get('expiry_date'), item_data.get('supplier'),
                    item_data.get('price'), item_data.get('status', 'good'),
                    item_data.get('blockchain_verified', False), item_data.get('rfid_tag'),
                    item_data.get('barcode'), item_data.get('description'),
                    item_data.get('created_by')
                ))
                return item_id
        except Exception as e:
            logger.error(f"Error creating inventory item: {e}")
            return None
    
    def update_item(self, item_id: str, updates: Dict) -> bool:
        """Update an inventory item"""
        try:
            set_clauses = []
            values = []
            
            for key, value in updates.items():
                if key in ['name', 'category', 'stock_quantity', 'threshold_quantity',
                          'expiry_date', 'supplier', 'price', 'status', 'blockchain_verified',
                          'rfid_tag', 'barcode', 'description']:
                    set_clauses.append(f"{key} = %s")
                    values.append(value)
            
            if not set_clauses:
                return False
            
            values.append(item_id)
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute(f"""
                    UPDATE inventory_items 
                    SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, values)
                return cursor.rowcount > 0
        except Exception as e:
            logger.error(f"Error updating inventory item {item_id}: {e}")
            return False
    
    def delete_item(self, item_id: str) -> bool:
        """Delete an inventory item"""
        try:
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("DELETE FROM inventory_items WHERE id = %s", (item_id,))
                return cursor.rowcount > 0
        except Exception as e:
            logger.error(f"Error deleting inventory item {item_id}: {e}")
            return False
    
    def get_low_stock_items(self) -> List[Dict]:
        """Get items with low stock"""
        try:
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM inventory_items 
                    WHERE stock_quantity <= threshold_quantity
                    ORDER BY stock_quantity ASC
                """)
                return cursor.fetchall()
        except Exception as e:
            logger.error(f"Error fetching low stock items: {e}")
            return []
    
    def add_transaction(self, transaction_data: Dict) -> Optional[str]:
        """Add inventory transaction"""
        try:
            transaction_id = self._generate_id()
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    INSERT INTO inventory_transactions (
                        id, item_id, transaction_type, quantity, previous_quantity,
                        new_quantity, reason, transaction_hash, created_by
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    transaction_id, transaction_data['item_id'],
                    transaction_data['transaction_type'], transaction_data['quantity'],
                    transaction_data['previous_quantity'], transaction_data['new_quantity'],
                    transaction_data.get('reason'), transaction_data.get('transaction_hash'),
                    transaction_data.get('created_by')
                ))
                return transaction_id
        except Exception as e:
            logger.error(f"Error adding inventory transaction: {e}")
            return None

class UserService(BaseService):
    """Service for user management"""
    
    def create_user(self, user_data: Dict) -> Optional[str]:
        """Create a new user"""
        try:
            user_id = self._generate_id()
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    INSERT INTO users (
                        id, firebase_uid, email, display_name, role
                    ) VALUES (%s, %s, %s, %s, %s)
                """, (
                    user_id, user_data['firebase_uid'], user_data['email'],
                    user_data.get('display_name'), user_data.get('role', 'user')
                ))
                return user_id
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return None
    
    def get_user_by_firebase_uid(self, firebase_uid: str) -> Optional[Dict]:
        """Get user by Firebase UID"""
        try:
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM users WHERE firebase_uid = %s
                """, (firebase_uid,))
                return cursor.fetchone()
        except Exception as e:
            logger.error(f"Error fetching user by Firebase UID: {e}")
            return None
    
    def update_user(self, user_id: str, updates: Dict) -> bool:
        """Update user information"""
        try:
            set_clauses = []
            values = []
            
            for key, value in updates.items():
                if key in ['display_name', 'role', 'is_active']:
                    set_clauses.append(f"{key} = %s")
                    values.append(value)
            
            if not set_clauses:
                return False
            
            values.append(user_id)
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute(f"""
                    UPDATE users 
                    SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, values)
                return cursor.rowcount > 0
        except Exception as e:
            logger.error(f"Error updating user {user_id}: {e}")
            return False

class MedicineService(BaseService):
    """Service for medicine recommendations"""
    
    def create_recommendation(self, recommendation_data: Dict) -> Optional[str]:
        """Create a new medicine recommendation"""
        try:
            recommendation_id = self._generate_id()
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    INSERT INTO medicine_recommendations (
                        id, disease_name, symptoms, recommended_medicines,
                        dosage_instructions, side_effects, contraindications,
                        urgency_level, ai_confidence_score, created_by
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    recommendation_id, recommendation_data['disease_name'],
                    recommendation_data['symptoms'], recommendation_data['recommended_medicines'],
                    recommendation_data.get('dosage_instructions'), recommendation_data.get('side_effects'),
                    recommendation_data.get('contraindications'), recommendation_data.get('urgency_level', 'medium'),
                    recommendation_data.get('ai_confidence_score'), recommendation_data.get('created_by')
                ))
                return recommendation_id
        except Exception as e:
            logger.error(f"Error creating medicine recommendation: {e}")
            return None
    
    def get_recommendations_by_symptoms(self, symptoms: List[str]) -> List[Dict]:
        """Get medicine recommendations by symptoms"""
        try:
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM medicine_recommendations 
                    WHERE symptoms && %s
                    ORDER BY ai_confidence_score DESC, created_at DESC
                """, (symptoms,))
                return cursor.fetchall()
        except Exception as e:
            logger.error(f"Error fetching recommendations by symptoms: {e}")
            return []
    
    def get_medicine_knowledge(self, medicine_name: str) -> Optional[Dict]:
        """Get medicine knowledge from MongoDB"""
        try:
            collection = self.db.get_mongo_db().medicine_knowledge_base
            return collection.find_one({"medicineName": medicine_name})
        except Exception as e:
            logger.error(f"Error fetching medicine knowledge for {medicine_name}: {e}")
            return None

class VoiceService(BaseService):
    """Service for voice medicine interactions"""
    
    def save_voice_interaction(self, interaction_data: Dict) -> Optional[str]:
        """Save voice interaction"""
        try:
            interaction_id = self._generate_id()
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    INSERT INTO voice_interactions (
                        id, user_id, transcript, confidence_score,
                        medicine_recommendation_id, interaction_type
                    ) VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    interaction_id, interaction_data['user_id'],
                    interaction_data['transcript'], interaction_data.get('confidence_score'),
                    interaction_data.get('medicine_recommendation_id'),
                    interaction_data.get('interaction_type', 'medicine_query')
                ))
                return interaction_id
        except Exception as e:
            logger.error(f"Error saving voice interaction: {e}")
            return None
    
    def get_user_interactions(self, user_id: str, limit: int = 50) -> List[Dict]:
        """Get user's voice interactions"""
        try:
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM voice_interactions 
                    WHERE user_id = %s
                    ORDER BY created_at DESC
                    LIMIT %s
                """, (user_id, limit))
                return cursor.fetchall()
        except Exception as e:
            logger.error(f"Error fetching user interactions: {e}")
            return []
    
    def save_voice_session(self, session_data: Dict) -> Optional[str]:
        """Save voice session to MongoDB"""
        try:
            collection = self.db.get_mongo_db().voice_medicine_sessions
            session_id = self._generate_id()
            session_data['sessionId'] = session_id
            session_data['startTime'] = datetime.utcnow()
            result = collection.insert_one(session_data)
            return str(result.inserted_id)
        except Exception as e:
            logger.error(f"Error saving voice session: {e}")
            return None

class AlertService(BaseService):
    """Service for alert management"""
    
    def create_alert(self, alert_data: Dict) -> Optional[str]:
        """Create a new alert"""
        try:
            alert_id = self._generate_id()
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    INSERT INTO alerts (
                        id, user_id, alert_type, title, message,
                        severity, related_item_id
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    alert_id, alert_data['user_id'], alert_data['alert_type'],
                    alert_data['title'], alert_data['message'],
                    alert_data.get('severity', 'medium'), alert_data.get('related_item_id')
                ))
                return alert_id
        except Exception as e:
            logger.error(f"Error creating alert: {e}")
            return None
    
    def get_user_alerts(self, user_id: str, unread_only: bool = False) -> List[Dict]:
        """Get user's alerts"""
        try:
            with self.db.get_postgres_cursor() as cursor:
                query = """
                    SELECT * FROM alerts 
                    WHERE user_id = %s
                """
                params = [user_id]
                
                if unread_only:
                    query += " AND is_read = FALSE"
                
                query += " ORDER BY created_at DESC"
                
                cursor.execute(query, params)
                return cursor.fetchall()
        except Exception as e:
            logger.error(f"Error fetching user alerts: {e}")
            return []
    
    def mark_alert_read(self, alert_id: str) -> bool:
        """Mark alert as read"""
        try:
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    UPDATE alerts 
                    SET is_read = TRUE 
                    WHERE id = %s
                """, (alert_id,))
                return cursor.rowcount > 0
        except Exception as e:
            logger.error(f"Error marking alert as read: {e}")
            return False
    
    def resolve_alert(self, alert_id: str) -> bool:
        """Resolve an alert"""
        try:
            with self.db.get_postgres_cursor() as cursor:
                cursor.execute("""
                    UPDATE alerts 
                    SET is_resolved = TRUE, resolved_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (alert_id,))
                return cursor.rowcount > 0
        except Exception as e:
            logger.error(f"Error resolving alert: {e}")
            return False

class CacheService(BaseService):
    """Service for Redis caching"""
    
    def set_cache(self, key: str, value: Any, expire_seconds: int = 3600) -> bool:
        """Set cache value"""
        try:
            serialized_value = json.dumps(value)
            return self.db.get_redis_client().setex(key, expire_seconds, serialized_value)
        except Exception as e:
            logger.error(f"Error setting cache for key {key}: {e}")
            return False
    
    def get_cache(self, key: str) -> Optional[Any]:
        """Get cache value"""
        try:
            value = self.db.get_redis_client().get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.error(f"Error getting cache for key {key}: {e}")
            return None
    
    def delete_cache(self, key: str) -> bool:
        """Delete cache value"""
        try:
            return bool(self.db.get_redis_client().delete(key))
        except Exception as e:
            logger.error(f"Error deleting cache for key {key}: {e}")
            return False
    
    def clear_pattern(self, pattern: str) -> int:
        """Clear cache by pattern"""
        try:
            keys = self.db.get_redis_client().keys(pattern)
            if keys:
                return self.db.get_redis_client().delete(*keys)
            return 0
        except Exception as e:
            logger.error(f"Error clearing cache pattern {pattern}: {e}")
            return 0


