# MedCHAIN HealthHub - AI-Powered Health & Wellness Platform

A comprehensive health and wellness ecosystem with AI-powered mental health tracking, fitness analytics, blockchain security, and personalized wellness recommendations.

## 🚀 Features

### 🤖 AI-Powered Features
- **Medicine Recommendations** - AI-powered medicine suggestions based on symptoms
- **Disease Diagnosis** - ML-based disease prediction and analysis
- **Mental Health Assessment** - Comprehensive mental health evaluation
- **Skin Analysis** - AI-powered skin condition analysis
- **Voice Medicine Assistant** - Voice-controlled medicine recommendations

### 🏥 Healthcare Management
- **Medical Records** - Comprehensive patient health information management
- **Prescription Manager** - Digital prescription tracking and management
- **Patient Profiles** - Detailed patient information and history
- **Inventory Management** - RFID-based medical supply tracking

### 💪 Health & Fitness
- **Fitness Dashboard** - Comprehensive fitness tracking and analytics
- **BMI Calculator** - Advanced health metrics and body composition analysis
- **Period Tracker** - Women's health tracking and predictions
- **Health Analytics** - Comprehensive health monitoring platform

### 🧘 Wellness & Mental Health
- **Mental Health Dashboard** - Comprehensive mental wellness tracking
- **Spotify Integration** - Music therapy and mood-based recommendations
- **AI Wellness Planner** - Personalized wellness and fitness plans

### 🔗 Blockchain & Security
- **GeneChain Unified** - Blockchain-based genetic data management
- **Marketplace** - Secure medical supply marketplace
- **RFID Management** - Blockchain-verified supply chain tracking

### 🚁 Advanced Features
- **Drone Delivery** - Medical supply delivery simulation
- **EchoMed AI** - Advanced AI health assistant
- **Infinite Memory** - Advanced memory management for healthcare data

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for data fetching

### Backend
- **Python 3.11** with FastAPI
- **Uvicorn** for ASGI server
- **PostgreSQL** for primary database
- **MongoDB** for document storage
- **Redis** for caching
- **Docker** for containerization

### AI & ML
- **OpenAI GPT** for natural language processing
- **Google Gemini** for AI-powered recommendations
- **Scikit-learn** for machine learning models
- **TensorFlow/PyTorch** for deep learning

### Authentication & Security
- **Firebase Authentication** with Google OAuth
- **JWT** for secure API communication
- **Blockchain** for data integrity

## 🚀 Deployment

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git
- Render account (for backend)
- Vercel account (for frontend)

### Backend Deployment (Render)

1. **Fork/Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Fullstack_med
   ```

2. **Deploy to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `fullstack-med-backend`
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r codezilla_spider/backend/requirements.txt`
     - **Start Command**: `cd codezilla_spider/backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables in Render**
   ```
   OPENAI_API_KEY=your_openai_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   SESSION_SECRET=your_session_secret
   YOUTUBE_API_KEY=your_youtube_api_key
   POSTGRES_HOST=your_postgres_host
   POSTGRES_PORT=5432
   POSTGRES_DB=medchain
   POSTGRES_USER=your_postgres_user
   POSTGRES_PASSWORD=your_postgres_password
   MONGO_URI=your_mongo_uri
   REDIS_HOST=your_redis_host
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   ```

### Frontend Deployment (Vercel)

1. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - **Framework Preset**: `Vite`
     - **Root Directory**: `codezilla_spider`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

2. **Set Environment Variables in Vercel**
   ```
   VITE_API_URL=https://fullstack-med-backend.onrender.com
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Fullstack_med
   ```

2. **Install frontend dependencies**
   ```bash
   cd codezilla_spider
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../codezilla_spider/backend
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in codezilla_spider directory
   cp create_env.py .env
   # Edit .env with your API keys
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Start frontend
   cd codezilla_spider
   npm run dev

   # Terminal 2: Start backend
   cd codezilla_spider/backend
   uvicorn main:app --reload --port 8000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
SESSION_SECRET=your_session_secret
YOUTUBE_API_KEY=your_youtube_api_key
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=medchain
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
MONGO_URI=mongodb://localhost:27017/
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## 📱 Mobile Responsive

The application is fully responsive and optimized for:
- 📱 Mobile devices
- 📱 Tablets
- 💻 Desktop computers
- 🖥️ Large screens

## 🔒 Security Features

- **Firebase Authentication** with Google OAuth
- **JWT token-based API security**
- **Environment variable protection**
- **CORS configuration**
- **Input validation and sanitization**
- **Rate limiting**
- **Blockchain data integrity**

## 🧪 Testing

```bash
# Frontend tests
cd codezilla_spider
npm run test

# Backend tests
cd codezilla_spider/backend
python -m pytest
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Bundle Size**: Optimized with code splitting
- **Loading Speed**: < 2 seconds initial load
- **SEO Optimized**: Meta tags and structured data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@medchain.com or join our Slack channel.

## 🙏 Acknowledgments

- OpenAI for GPT integration
- Google for Gemini AI
- Firebase for authentication
- Vercel for frontend hosting
- Render for backend hosting
- All contributors and supporters

---

**Made with ❤️ for better healthcare**
