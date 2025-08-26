#!/bin/bash

# MedCHAIN HealthHub Deployment Script
# This script helps deploy the application to Render and Vercel

echo "🚀 MedCHAIN HealthHub Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "render.yaml" ] || [ ! -d "codezilla_spider" ]; then
    print_error "Please run this script from the Fullstack_med directory"
    exit 1
fi

print_status "Starting deployment process..."

# Step 1: Check prerequisites
print_status "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

print_success "All prerequisites are met!"

# Step 2: Install dependencies
print_status "Installing frontend dependencies..."
cd codezilla_spider
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi
print_success "Frontend dependencies installed!"

# Step 3: Build frontend
print_status "Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build frontend"
    exit 1
fi
print_success "Frontend built successfully!"

cd ..

# Step 4: Check environment variables
print_status "Checking environment variables..."

# Check if .env file exists in frontend
if [ ! -f "codezilla_spider/.env" ]; then
    print_warning "No .env file found in codezilla_spider directory"
    print_status "Creating .env file from template..."
    cp codezilla_spider/create_env.py codezilla_spider/.env
    print_warning "Please edit codezilla_spider/.env with your API keys before deployment"
fi

# Step 5: Git status check
print_status "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Please commit them before deployment."
    echo "Uncommitted files:"
    git status --porcelain
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deployment cancelled by user"
        exit 0
    fi
fi

# Step 6: Deployment instructions
echo ""
echo "🎯 Deployment Instructions"
echo "========================"
echo ""
echo "📋 Backend Deployment (Render):"
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect your GitHub repository"
echo "4. Configure the service:"
echo "   - Name: fullstack-med-backend"
echo "   - Environment: Python 3"
echo "   - Build Command: pip install -r codezilla_spider/backend/requirements.txt"
echo "   - Start Command: cd codezilla_spider/backend && uvicorn main:app --host 0.0.0.0 --port \$PORT"
echo ""
echo "🔑 Set these environment variables in Render:"
echo "   - OPENAI_API_KEY"
echo "   - ELEVENLABS_API_KEY"
echo "   - SESSION_SECRET"
echo "   - YOUTUBE_API_KEY"
echo "   - POSTGRES_HOST"
echo "   - POSTGRES_PORT"
echo "   - POSTGRES_DB"
echo "   - POSTGRES_USER"
echo "   - POSTGRES_PASSWORD"
echo "   - MONGO_URI"
echo "   - REDIS_HOST"
echo "   - REDIS_PORT"
echo "   - REDIS_PASSWORD"
echo ""
echo "🌐 Frontend Deployment (Vercel):"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'New Project'"
echo "3. Import your GitHub repository"
echo "4. Configure the project:"
echo "   - Framework Preset: Vite"
echo "   - Root Directory: codezilla_spider"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo ""
echo "🔑 Set these environment variables in Vercel:"
echo "   - VITE_API_URL=https://your-backend-url.onrender.com"
echo "   - VITE_FIREBASE_API_KEY"
echo "   - VITE_FIREBASE_AUTH_DOMAIN"
echo "   - VITE_FIREBASE_PROJECT_ID"
echo "   - VITE_FIREBASE_STORAGE_BUCKET"
echo "   - VITE_FIREBASE_MESSAGING_SENDER_ID"
echo "   - VITE_FIREBASE_APP_ID"
echo "   - VITE_FIREBASE_MEASUREMENT_ID"
echo "   - VITE_GEMINI_API_KEY"
echo ""

# Step 7: Local development instructions
echo "💻 Local Development:"
echo "==================="
echo ""
echo "To run the application locally:"
echo ""
echo "Terminal 1 (Frontend):"
echo "  cd codezilla_spider"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Backend):"
echo "  cd codezilla_spider/backend"
echo "  uvicorn main:app --reload --port 8000"
echo ""
echo "Access the application at:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend: http://localhost:8000"
echo ""

print_success "Deployment script completed!"
print_status "Follow the instructions above to deploy your application."
print_status "Make sure to set all required environment variables in your deployment platforms."
