# Promoter Validation System

## Overview

The Promoter Validation System is an AI-driven DNA sequence analysis platform that classifies DNA sequences as promoters or non-promoters using machine learning models and provides immutable audit trails through blockchain integration.

## Features

### 🔬 Core Functionality
- **DNA Sequence Validation**: Validates and processes DNA sequences (A, T, C, G)
- **ML-Based Classification**: Uses Random Forest and Logistic Regression models
- **Biological Motif Detection**: Identifies common promoter motifs (TATA Box, CAAT Box, etc.)
- **Confidence Scoring**: Provides probability scores for predictions
- **Real-time Analysis**: Fast processing with immediate results

### 🔗 Blockchain Integration
- **Immutable Audit Trail**: All validations logged to blockchain
- **Smart Contract**: Solidity contract for tamper-proof storage
- **Transaction Tracking**: Complete history with Etherscan links
- **Access Control**: Patient data privacy through blockchain permissions

### 🗄️ Database Management
- **PostgreSQL Storage**: Structured data storage for validations
- **Patient History**: Complete validation history per patient
- **Model Metadata**: ML model versioning and tracking
- **Statistics**: Comprehensive analytics and reporting

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   FastAPI       │    │   PostgreSQL    │
│   (React)       │◄──►│   Backend       │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Blockchain    │
                       │   (Ethereum)    │
                       └─────────────────┘
```

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **FastAPI** (Python 3.9+)
- **scikit-learn** for ML models
- **PostgreSQL** for data storage
- **Redis** for caching

### Blockchain
- **Solidity** smart contracts
- **Ethereum** (Sepolia testnet)
- **Web3.py** for integration

### Infrastructure
- **Docker** containerization
- **Docker Compose** orchestration
- **Nginx** reverse proxy (optional)

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git
- Node.js 18+ (for frontend development)
- Python 3.9+ (for backend development)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd shine2/codezilla_spider
```

### 2. Deploy with Docker
```bash
# Make deployment script executable
chmod +x deploy-promoter.sh

# Run deployment
./deploy-promoter.sh
```

### 3. Manual Setup (Alternative)
```bash
# Start services
docker-compose -f docker-compose.promoter.yml up --build -d

# Check status
docker-compose -f docker-compose.promoter.yml ps
```

### 4. Access Services
- **API**: http://localhost:8002
- **API Docs**: http://localhost:8002/docs
- **Database**: localhost:5433
- **Redis**: localhost:6380

## API Endpoints

### Core Validation
```http
POST /promoter/validate
Content-Type: application/x-www-form-urlencoded

sequence=ATCGATCGATCG&patient_id=P12345&analyst_id=ANALYST001&user_role=Doctor
```

### Blockchain Integration
```http
POST /promoter/log-to-chain
Content-Type: application/json

{
  "patient_id": "P12345",
  "validation_id": "123"
}
```

### History & Analytics
```http
GET /promoter/history/{patient_id}
GET /promoter/stats
GET /promoter/models
GET /promoter/transaction/{tx_hash}
```

## Usage Examples

### 1. Validate DNA Sequence
```python
import requests

# Validate a promoter sequence
response = requests.post(
    "http://localhost:8002/promoter/validate",
    data={
        "sequence": "TATAAAATCGATCGATCG",
        "patient_id": "P12345",
        "analyst_id": "ANALYST001",
        "user_role": "Doctor"
    }
)

result = response.json()
print(f"Prediction: {result['prediction']}")
print(f"Confidence: {result['probability']:.2%}")
print(f"Motifs Found: {len([m for m in result['motifs_found'] if m['found']])}")
```

### 2. Get Patient History
```python
# Get validation history
history = requests.get("http://localhost:8002/promoter/history/P12345").json()
print(f"Total validations: {history['total_count']}")
```

### 3. Check Blockchain Transaction
```python
# Get transaction details
tx_details = requests.get(f"http://localhost:8002/promoter/transaction/{result['blockchain_tx']}").json()
print(f"Block number: {tx_details['transaction']['block_number']}")
```

## ML Models

### Model Types
1. **Random Forest Classifier**
   - High accuracy for complex patterns
   - Good for non-linear relationships
   - Feature importance analysis

2. **Logistic Regression**
   - Fast and interpretable
   - Linear decision boundaries
   - Probability calibration

### Feature Engineering
- **k-mer Frequency**: 3-mer frequency analysis
- **Sequence Length**: Normalized sequence features
- **Motif Presence**: Binary motif indicators

### Model Training
```python
# Models are automatically created on first run
# Training data: 1000 synthetic sequences (500 promoters, 500 non-promoters)
# Features: 64-dimensional k-mer frequency vectors
# Validation: Cross-validation with 80/20 split
```

## Smart Contract

### Key Functions
```solidity
// Log validation to blockchain
function logValidation(
    bytes32 sequenceHash,
    bytes32 modelHash,
    string prediction,
    uint256 probability,
    bytes32 patientId
) external

// Register new ML model
function registerModel(
    bytes32 modelHash,
    string modelName,
    string version
) external

// Access control
function grantAccess(address user, bytes32 patientId) external
function revokeAccess(address user, bytes32 patientId) external
```

### Events
- `ValidationLogged`: Emitted when validation is recorded
- `ModelRegistered`: Emitted when new model is registered
- `AccessGranted/Revoked`: Emitted for access control changes

## Database Schema

### promoter_validations
```sql
CREATE TABLE promoter_validations (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50),
    analyst_id VARCHAR(50) NOT NULL,
    sequence_hash VARCHAR(64) NOT NULL,
    prediction VARCHAR(20) NOT NULL,
    probability DECIMAL(5,4) NOT NULL,
    motifs_found JSONB,
    model_version_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validation_hash VARCHAR(64) NOT NULL
);
```

### chain_logs
```sql
CREATE TABLE chain_logs (
    id SERIAL PRIMARY KEY,
    validation_id INTEGER REFERENCES promoter_validations(id),
    blockchain_tx VARCHAR(66) NOT NULL,
    block_number BIGINT,
    gas_used INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Configuration

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_NAME=genechain
DB_USER=postgres
DB_PASSWORD=password
DB_PORT=5432

# Blockchain
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your_private_key

# API
API_HOST=0.0.0.0
API_PORT=8002
CORS_ORIGINS=http://localhost:3001,http://localhost:3000
```

## Development

### Local Development Setup
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python promoter_validation_api.py

# Frontend
cd ../src
npm install
npm run dev
```

### Testing
```bash
# API Tests
cd backend
python -m pytest tests/

# Smart Contract Tests
cd blockchain
npx hardhat test
```

## Monitoring & Logs

### View Logs
```bash
# All services
docker-compose -f docker-compose.promoter.yml logs -f

# Specific service
docker-compose -f docker-compose.promoter.yml logs -f promoter-api
```

### Health Checks
```bash
# API Health
curl http://localhost:8002/health

# Database Health
docker-compose -f docker-compose.promoter.yml exec postgres pg_isready -U postgres
```

## Troubleshooting

### Common Issues

1. **Docker not running**
   ```bash
   # Start Docker Desktop
   # Check status
   docker info
   ```

2. **Port conflicts**
   ```bash
   # Check port usage
   netstat -tulpn | grep :8002
   # Change ports in docker-compose.promoter.yml
   ```

3. **Database connection failed**
   ```bash
   # Check PostgreSQL logs
   docker-compose -f docker-compose.promoter.yml logs postgres
   # Restart database
   docker-compose -f docker-compose.promoter.yml restart postgres
   ```

4. **ML models not loading**
   ```bash
   # Check model files
   ls -la backend/models/
   # Rebuild container
   docker-compose -f docker-compose.promoter.yml up --build promoter-api
   ```

## Security Considerations

### Data Privacy
- Patient IDs are hashed before blockchain storage
- Access control through smart contract permissions
- Encrypted database connections

### Model Security
- Model hashes verified before predictions
- Version control for ML models
- Audit trail for model updates

### API Security
- Input validation for DNA sequences
- Rate limiting (implemented in production)
- CORS configuration for frontend access

## Performance Optimization

### Caching
- Redis for frequent queries
- Model prediction caching
- Database query optimization

### Scaling
- Horizontal scaling with load balancer
- Database read replicas
- CDN for static assets

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create GitHub issue
- Check documentation
- Review troubleshooting guide

---

**GeneChain Team** - Building the future of genetic medicine with blockchain technology.


