# MedChain Database Setup

This directory contains the complete database setup for the MedChain application, including PostgreSQL, MongoDB, and Redis.

## 🏗️ Architecture

MedChain uses a multi-database architecture:

- **PostgreSQL**: Primary relational database for structured data
- **MongoDB**: Document database for flexible data storage
- **Redis**: Caching layer for performance optimization

## 📋 Prerequisites

1. **Docker Desktop**: Install from [docker.com](https://www.docker.com/products/docker-desktop/)
2. **Python 3.8+**: For running the setup scripts
3. **Git**: For version control

## 🚀 Quick Start

### 1. Install Database Services

```bash
# Navigate to the database directory
cd shine2/codezilla_spider/database

# Run the full installation
python setup.py install
```

This will:
- Start all database services using Docker
- Create the environment file
- Initialize the databases with sample data

### 2. Verify Installation

```bash
# Check database status
python setup.py status
```

You should see all services running and connection information.

## 📊 Database Services

### PostgreSQL (Primary Database)
- **Port**: 5432
- **Database**: medchain
- **Username**: medchain_user
- **Password**: medchain_password

**Tables**:
- `users` - User management
- `inventory_items` - Inventory management
- `medicine_recommendations` - AI medicine recommendations
- `voice_interactions` - Voice medicine interactions
- `inventory_transactions` - Transaction history
- `alerts` - System alerts
- `blockchain_transactions` - Blockchain integration
- `ml_predictions` - ML model predictions
- `skin_analysis_results` - Skin analysis data
- `user_sessions` - User session management

### MongoDB (Document Database)
- **Port**: 27017
- **Database**: medchain
- **Username**: medchain_admin
- **Password**: medchain_password

**Collections**:
- `voice_medicine_sessions` - Voice interaction sessions
- `medicine_knowledge_base` - Medicine information
- `ai_conversations` - AI conversation history
- `ml_model_versions` - ML model management
- `user_preferences` - User preferences

### Redis (Cache Layer)
- **Port**: 6379
- **Password**: medchain_redis_password

**Usage**:
- Session caching
- API response caching
- Real-time data caching

## 🛠️ Management Interfaces

### pgAdmin (PostgreSQL Management)
- **URL**: http://localhost:5050
- **Email**: admin@medchain.com
- **Password**: admin_password

### Mongo Express (MongoDB Management)
- **URL**: http://localhost:8081
- **Username**: admin
- **Password**: admin_password

## 📝 Database Schema

### PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    firebase_uid VARCHAR(128) UNIQUE,
    email VARCHAR(255) UNIQUE,
    display_name VARCHAR(255),
    role VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_active BOOLEAN
);

-- Inventory items table
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    category VARCHAR(100),
    stock_quantity INTEGER,
    threshold_quantity INTEGER,
    expiry_date DATE,
    supplier VARCHAR(255),
    price DECIMAL(10,2),
    status VARCHAR(20),
    blockchain_verified BOOLEAN,
    rfid_tag VARCHAR(100),
    barcode VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- And more tables...
```

### MongoDB Schema

```javascript
// Voice medicine sessions
{
  userId: String,
  sessionId: String,
  startTime: Date,
  endTime: Date,
  interactions: Array,
  summary: Object
}

// Medicine knowledge base
{
  medicineName: String,
  category: String,
  activeIngredients: Array,
  dosageForms: Array,
  sideEffects: Array,
  contraindications: Array,
  interactions: Array,
  lastUpdated: Date
}
```

## 🔧 Database Operations

### Using the Setup Script

```bash
# Start databases
python setup.py start

# Stop databases
python setup.py stop

# Reset databases (WARNING: deletes all data)
python setup.py reset

# Show status
python setup.py status

# Create environment file
python setup.py env
```

### Using Docker Compose Directly

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Reset everything
docker-compose down -v
docker-compose up -d
```

## 🔌 Integration with Application

### Backend Integration

The database services are integrated into the backend through the `database` package:

```python
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
medicine_service = MedicineService()
voice_service = VoiceService()
alert_service = AlertService()
cache_service = CacheService()

# Use services
items = inventory_service.get_all_items()
user = user_service.get_user_by_firebase_uid(firebase_uid)
```

### Frontend Integration

The frontend connects to the backend APIs, which use the database services:

```typescript
// Example API calls
const response = await fetch('/api/inventory/items');
const items = await response.json();

const userResponse = await fetch('/api/users/profile');
const user = await userResponse.json();
```

## 🔒 Security

### Environment Variables

All sensitive configuration is stored in environment variables:

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

1. **Never commit passwords** to version control
2. **Use strong passwords** in production
3. **Enable SSL/TLS** for production databases
4. **Regular backups** of all databases
5. **Access control** through user roles

## 📈 Performance Optimization

### Indexes

PostgreSQL indexes are automatically created for:
- User lookups by Firebase UID
- Inventory items by category and status
- Transactions by date
- Alerts by user and read status

### Caching Strategy

Redis is used for:
- **Session caching**: User sessions
- **API caching**: Frequently accessed data
- **Real-time data**: Live inventory updates

### Connection Pooling

The application uses connection pooling for:
- PostgreSQL connections
- MongoDB connections
- Redis connections

## 🚨 Troubleshooting

### Common Issues

1. **Docker not running**
   ```bash
   # Start Docker Desktop
   # Then run:
   python setup.py start
   ```

2. **Port conflicts**
   ```bash
   # Check what's using the ports
   netstat -an | grep :5432
   netstat -an | grep :27017
   netstat -an | grep :6379
   ```

3. **Database connection errors**
   ```bash
   # Check database status
   python setup.py status
   
   # Restart databases
   python setup.py stop
   python setup.py start
   ```

4. **Permission errors**
   ```bash
   # Make sure Docker has proper permissions
   # On Linux, add user to docker group:
   sudo usermod -aG docker $USER
   ```

### Logs

View logs for troubleshooting:

```bash
# PostgreSQL logs
docker-compose logs postgres

# MongoDB logs
docker-compose logs mongodb

# Redis logs
docker-compose logs redis
```

## 🔄 Backup and Restore

### Backup

```bash
# PostgreSQL backup
docker exec medchain-postgres pg_dump -U medchain_user medchain > backup.sql

# MongoDB backup
docker exec medchain-mongodb mongodump --db medchain --out /backup

# Redis backup (automatic with AOF)
docker exec medchain-redis redis-cli BGSAVE
```

### Restore

```bash
# PostgreSQL restore
docker exec -i medchain-postgres psql -U medchain_user medchain < backup.sql

# MongoDB restore
docker exec medchain-mongodb mongorestore --db medchain /backup/medchain
```

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contributing

When adding new database features:

1. Update the schema files (`init.sql`, `mongo-init.js`)
2. Add corresponding service methods
3. Update this README
4. Test with the setup script

## 📞 Support

For database-related issues:

1. Check the troubleshooting section
2. Review the logs
3. Verify environment variables
4. Test database connections manually


