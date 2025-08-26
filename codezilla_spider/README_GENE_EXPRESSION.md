# 🧬 GeneChain Unified Platform - Gene Expression Audit Trail

## Overview

The GeneChain Unified Platform now includes a comprehensive **Immutable Gene Expression Audit Trail** feature that combines machine learning, blockchain technology, and advanced analytics for secure, transparent, and auditable genetic analysis.

## 🚀 Features

### 🔹 Core Capabilities

- **📊 Unified Dashboard**: Comprehensive overview with real-time statistics
- **🧬 Gene Expression Analysis**: ML-powered ALL/AML classification
- **🔗 Blockchain Integration**: Immutable audit trail on Ethereum Sepolia
- **📈 Advanced Analytics**: Top contributing genes and confidence scores
- **📋 Report Generation**: Automated PDF reports with blockchain verification
- **🔐 Multi-Role Access**: Doctor, Regulator, and Patient interfaces

### 🔹 ML Models

1. **Random Forest Classifier** - Baseline model for gene expression analysis
2. **Support Vector Machine (SVM)** - Recommended model with RBF kernel
3. **Multi-layer Perceptron (MLP)** - Experimental neural network approach

### 🔹 Blockchain Features

- **Smart Contract Integration**: Automated logging of analysis results
- **Transaction Verification**: Immutable audit trail with transaction hashes
- **Sepolia Testnet**: Real blockchain integration for testing
- **Audit Trail**: Complete history of all genetic analyses

## 🏗️ Architecture

### Frontend (React + TypeScript)
```
src/components/genechain-assist/
├── UnifiedGeneChain.tsx          # Main unified dashboard
├── ProposalForm.tsx              # Genetic edit proposals
├── ProposalsList.tsx             # Proposal management
└── ProposalDetails.tsx           # Detailed proposal view
```

### Backend (FastAPI + Python)
```
backend/
├── gene_expression_api.py        # Main API server
├── requirements.txt              # Python dependencies
├── Dockerfile                    # Container configuration
└── models/                       # ML model storage
```

### Database Layer
- **PostgreSQL**: Metadata and patient history
- **MongoDB**: Document storage for reports
- **Redis**: Caching and session management

## 🛠️ Installation & Setup

### Prerequisites
- Docker Desktop
- Node.js 18+
- Python 3.11+
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codezilla_spider
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:8001
   - API Documentation: http://localhost:8001/docs

### Manual Setup

#### Frontend Setup
```bash
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python gene_expression_api.py
```

## 📊 API Endpoints

### Core Analysis
- `POST /analyze` - Upload and analyze gene expression data
- `GET /health` - System health check
- `GET /models` - Available ML models

### Audit Trail
- `GET /audit/{patient_id}` - Patient-specific audit trail
- `GET /audit` - All audit logs
- `POST /report` - Generate PDF reports

### Statistics
- `GET /stats` - System statistics and analytics

## 🔬 Gene Expression Analysis Workflow

### 1. Data Upload
- Upload CSV files with gene expression data
- Support for ALL/AML classification datasets
- Automatic preprocessing and validation

### 2. ML Analysis
- **Preprocessing**: Scaling, normalization, feature selection
- **Model Selection**: Choose from RF, SVM, or MLP
- **Prediction**: ALL vs AML classification with confidence scores
- **Feature Importance**: Top contributing genes identification

### 3. Blockchain Integration
- **Model Hash**: Unique identifier for analysis
- **Transaction Logging**: Immutable record on Sepolia testnet
- **Audit Trail**: Complete history with timestamps

### 4. Report Generation
- **PDF Reports**: Comprehensive analysis documentation
- **Blockchain Verification**: Transaction hash inclusion
- **Patient Records**: Secure storage and retrieval

## 🎯 Use Cases

### For Doctors
- Upload patient gene expression data
- Get ML-powered ALL/AML predictions
- Access immutable audit trail
- Generate comprehensive reports

### For Regulators
- Verify analysis integrity via blockchain
- Audit complete analysis history
- Monitor system compliance
- Access regulatory reports

### For Patients
- View their analysis results
- Verify data integrity
- Access audit trail
- Download reports

## 🔐 Security & Compliance

### Data Protection
- **Encryption**: All data encrypted in transit and at rest
- **Access Control**: Role-based permissions
- **Audit Logging**: Complete activity tracking
- **GDPR Compliance**: Patient data protection

### Blockchain Security
- **Immutable Records**: Tamper-proof audit trail
- **Smart Contracts**: Automated compliance checks
- **Decentralized Storage**: Enhanced security
- **Verification**: Public blockchain verification

## 📈 Performance & Scalability

### ML Model Performance
- **Accuracy**: >90% on ALL/AML classification
- **Speed**: <5 seconds for analysis
- **Scalability**: Support for large datasets
- **Real-time**: Live analysis capabilities

### System Architecture
- **Microservices**: Scalable backend architecture
- **Containerization**: Docker-based deployment
- **Load Balancing**: Horizontal scaling support
- **Caching**: Redis-based performance optimization

## 🚀 Deployment

### Production Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Monitor services
docker-compose logs -f
```

### Cloud Deployment
- **AWS**: ECS/EKS deployment
- **GCP**: Cloud Run/GKE deployment
- **Azure**: AKS deployment
- **Vercel**: Frontend hosting

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/db
MONGODB_URL=mongodb://host:port/db
REDIS_URL=redis://host:port

# Blockchain
BLOCKCHAIN_NETWORK=sepolia
INFURA_API_KEY=your_infura_key

# ML Models
MODEL_PATH=/app/models
```

### ML Model Configuration
```python
# Model parameters
RANDOM_FOREST_PARAMS = {
    'n_estimators': 100,
    'max_depth': 10,
    'random_state': 42
}

SVM_PARAMS = {
    'kernel': 'rbf',
    'C': 1.0,
    'probability': True
}
```

## 📊 Monitoring & Analytics

### System Metrics
- **API Response Times**: Performance monitoring
- **Model Accuracy**: ML model performance
- **Blockchain Transactions**: Audit trail metrics
- **User Activity**: Usage analytics

### Health Checks
- **Service Status**: All services health monitoring
- **Database Connectivity**: Connection status
- **ML Model Status**: Model availability
- **Blockchain Status**: Network connectivity

## 🧪 Testing

### Unit Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend
python -m pytest tests/
```

### Integration Tests
```bash
# API tests
python -m pytest tests/integration/

# End-to-end tests
npm run test:e2e
```

## 📚 Documentation

### API Documentation
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc
- **OpenAPI Spec**: http://localhost:8001/openapi.json

### User Guides
- **Doctor Guide**: Comprehensive analysis workflow
- **Regulator Guide**: Audit and compliance procedures
- **Patient Guide**: Result interpretation and access

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

### Code Standards
- **Frontend**: ESLint + Prettier
- **Backend**: Black + Flake8
- **Testing**: Jest + Pytest
- **Documentation**: JSDoc + Sphinx

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check the docs first
- **Issues**: GitHub Issues for bugs
- **Discussions**: GitHub Discussions for questions
- **Email**: support@genechain.com

### Community
- **Discord**: Join our community
- **Twitter**: Follow for updates
- **Blog**: Technical articles and updates

---

## 🎉 Quick Demo

1. **Navigate to GeneChain**: http://localhost:3001/genechain
2. **Select "Gene Expression Audit Trail"** from sidebar
3. **Upload sample data** in the Upload tab
4. **View analysis results** in the Analysis tab
5. **Check blockchain audit** in the Blockchain tab
6. **Generate report** in the Report tab

**Experience the future of genetic analysis with immutable blockchain audit trails!** 🧬🔗


