# MedChain Database Setup Guide

This guide will help you set up a complete database system for your MedChain application with PostgreSQL, MongoDB, and Redis.

## 🎯 What You'll Get

After following this guide, you'll have:

- ✅ **PostgreSQL**: Primary database for structured data (inventory, users, transactions)
- ✅ **MongoDB**: Document database for flexible data (voice sessions, medicine knowledge)
- ✅ **Redis**: Caching layer for performance optimization
- ✅ **Management Interfaces**: pgAdmin and Mongo Express for database management
- ✅ **API Endpoints**: REST API for database operations
- ✅ **Sample Data**: Pre-populated with test data

## 📋 Prerequisites

1. **Docker Desktop**: [Download and install](https://www.docker.com/products/docker-desktop/)
2. **Python 3.8+**: For running setup scripts
3. **Git**: For version control

## 🚀 Quick Setup (Recommended)

### Step 1: Navigate to Database Directory

```bash
cd shine2/codezilla_spider/database
```

### Step 2: Run Full Installation

```bash
python setup.py install
```

This single command will:
- Start all database services using Docker
- Create the environment file with database credentials
- Initialize databases with sample data
- Set up management interfaces

### Step 3: Verify Installation

```bash
python setup.py status
```

You should see all services running and connection information.

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually or the quick setup doesn't work:

### Step 1: Start Database Services

```bash
cd shine2/codezilla_spider/database
docker-compose up -d
```

### Step 2: Wait for Services to Start

```bash
# Check if services are running
docker-compose ps
```

### Step 3: Create Environment File

```bash
python setup.py env
```

### Step 4: Install Python Dependencies

```bash
cd ../
pip install -r backend/requirements.txt
```

## 📊 Database Services Overview

### PostgreSQL (Primary Database)
- **Port**: 5432
- **Database**: medchain
- **Username**: medchain_user
- **Password**: medchain_password

**What it stores**:
- User accounts and profiles
- Inventory items and transactions
- Medicine recommendations
- Voice interactions
- System alerts
- Blockchain transactions
- ML predictions
- Skin analysis results

### MongoDB (Document Database)
- **Port**: 27017
- **Database**: medchain
- **Username**: medchain_admin
- **Password**: medchain_password

**What it stores**:
- Voice medicine sessions
- Medicine knowledge base
- AI conversation history
- ML model versions
- User preferences

### Redis (Cache Layer)
- **Port**: 6379
- **Password**: medchain_redis_password

**What it stores**:
- Session data
- API response cache
- Real-time data

## 🛠️ Management Interfaces

### pgAdmin (PostgreSQL Management)
- **URL**: http://localhost:5050
- **Email**: admin@medchain.com
- **Password**: admin_password

**Features**:
- Browse and edit database tables
- Run SQL queries
- Monitor database performance
- Manage users and permissions

### Mongo Express (MongoDB Management)
- **URL**: http://localhost:8081
- **Username**: admin
- **Password**: admin_password

**Features**:
- Browse collections
- Edit documents
- Run queries
- Monitor database stats

## 🔌 Integration with Your Application

### Backend Integration

The database services are ready to use in your backend:

```python
# Example usage in your backend
from database import (
    InventoryService,
    UserService,
    MedicineService,
    VoiceService,
    AlertService,
    CacheService
)

# Initialize services
inventory_service = InventoryService()
user_service = UserService()

# Use services
items = inventory_service.get_all_items()
user = user_service.get_user_by_firebase_uid(firebase_uid)
```

### API Endpoints

The database API is available at `http://localhost:8001`:

```bash
# Health check
curl http://localhost:8001/health

# Get inventory items
curl http://localhost:8001/api/inventory/items

# Get medicine recommendations
curl "http://localhost:8001/api/medicine/recommendations?symptoms=fever,headache"
```

### Frontend Integration

Update your frontend to use the database API:

```typescript
// Example API calls
const response = await fetch('http://localhost:8001/api/inventory/items');
const data = await response.json();
console.log(data.items);
```

## 📝 Database Schema

### PostgreSQL Tables

The database includes these tables:

1. **users** - User management
2. **inventory_items** - Inventory management
3. **medicine_recommendations** - AI medicine recommendations
4. **voice_interactions** - Voice medicine interactions
5. **inventory_transactions** - Transaction history
6. **alerts** - System alerts
7. **blockchain_transactions** - Blockchain integration
8. **ml_predictions** - ML model predictions
9. **skin_analysis_results** - Skin analysis data
10. **user_sessions** - User session management

### MongoDB Collections

The database includes these collections:

1. **voice_medicine_sessions** - Voice interaction sessions
2. **medicine_knowledge_base** - Medicine information
3. **ai_conversations** - AI conversation history
4. **ml_model_versions** - ML model management
5. **user_preferences** - User preferences

## 🔒 Security Configuration

### Environment Variables

The setup creates a `.env` file with database credentials:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=medchain
POSTGRES_USER=medchain_user
POSTGRES_PASSWORD=medchain_password

MONGO_URI=mongodb://medchain_admin:medchain_password@localhost:27017/

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=medchain_redis_password
```

### Security Best Practices

1. **Change default passwords** in production
2. **Use SSL/TLS** for database connections
3. **Restrict network access** to database ports
4. **Regular backups** of all databases
5. **Monitor database access** logs

## 🚨 Troubleshooting

### Common Issues

#### 1. Docker Not Running
```bash
# Start Docker Desktop first
# Then run:
python setup.py start
```

#### 2. Port Conflicts
```bash
# Check what's using the ports
netstat -an | grep :5432
netstat -an | grep :27017
netstat -an | grep :6379

# Stop conflicting services or change ports in docker-compose.yml
```

#### 3. Permission Errors
```bash
# On Linux, add user to docker group:
sudo usermod -aG docker $USER
# Then log out and log back in
```

#### 4. Database Connection Errors
```bash
# Check database status
python setup.py status

# Restart databases
python setup.py stop
python setup.py start
```

### Viewing Logs

```bash
# PostgreSQL logs
docker-compose logs postgres

# MongoDB logs
docker-compose logs mongodb

# Redis logs
docker-compose logs redis

# All logs
docker-compose logs -f
```

### Resetting Everything

If you need to start fresh:

```bash
# Stop and remove everything
python setup.py reset

# Or manually:
docker-compose down -v
docker-compose up -d
```

## 📈 Performance Optimization

### Indexes

PostgreSQL indexes are automatically created for:
- User lookups by Firebase UID
- Inventory items by category and status
- Transactions by date
- Alerts by user and read status

### Caching Strategy

Redis is configured for:
- **Session caching**: User sessions
- **API caching**: Frequently accessed data
- **Real-time data**: Live inventory updates

### Connection Pooling

The application uses connection pooling for:
- PostgreSQL connections
- MongoDB connections
- Redis connections

## 🔄 Backup and Restore

### Creating Backups

```bash
# PostgreSQL backup
docker exec medchain-postgres pg_dump -U medchain_user medchain > backup.sql

# MongoDB backup
docker exec medchain-mongodb mongodump --db medchain --out /backup

# Redis backup (automatic with AOF)
docker exec medchain-redis redis-cli BGSAVE
```

### Restoring Backups

```bash
# PostgreSQL restore
docker exec -i medchain-postgres psql -U medchain_user medchain < backup.sql

# MongoDB restore
docker exec medchain-mongodb mongorestore --db medchain /backup/medchain
```

## 🎯 Next Steps

After setting up the database:

1. **Test the API**: Visit http://localhost:8001/docs for API documentation
2. **Explore Management Interfaces**: Use pgAdmin and Mongo Express
3. **Integrate with Your App**: Update your backend to use the database services
4. **Add Your Data**: Start adding your own inventory items and users
5. **Monitor Performance**: Use the management interfaces to monitor database performance

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs using `docker-compose logs`
3. Verify environment variables in the `.env` file
4. Test database connections manually
5. Check the comprehensive README in the `database/` directory

## 🎉 Congratulations!

You now have a complete, production-ready database system for your MedChain application! The system includes:

- ✅ Multi-database architecture
- ✅ REST API endpoints
- ✅ Management interfaces
- ✅ Sample data
- ✅ Security configuration
- ✅ Performance optimization
- ✅ Backup and restore capabilities

Your MedChain application is now ready to store and manage data properly!


