# MedCHAIN🫀 - AI-Powered Medical Management System

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-blue.svg)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini_AI-API-red.svg)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Platform-orange.svg)](https://firebase.google.com/)

> Revolutionizing healthcare management with intelligent AI recommendations, comprehensive inventory tracking, and seamless digital health consultations.

## ⚠️ IMPORTANT MEDICAL DISCLAIMER

**MedCHAIN🫀** is designed as a medical management and informational tool. AI-generated recommendations are for informational purposes only and should **NOT** replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions. Users assume full responsibility for any actions taken based on system recommendations.

## 📋 Table of Contents

- [📋 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [⚙️ Installation Guide](#️-installation-guide)
- [🔐 Environment Setup](#-environment-setup)
- [🚀 Usage Guide](#-usage-guide)
- [🔌 API Integration](#-api-integration)
- [☁️ Deployment](#️-deployment)
- [👨‍💻 Development](#-development)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 📋 Project Overview

**MedCHAIN🫀** represents the next generation of healthcare management systems, seamlessly integrating cutting-edge AI technology with practical medical administration tools. Our platform empowers healthcare professionals with intelligent decision support while maintaining the highest standards of medical accuracy and compliance.

### Core Capabilities

- **🤖 AI-Powered Intelligence**: Google Gemini AI integration for intelligent medicine recommendations and health consultations
- **📦 Smart Inventory**: RFID and QR code technology for seamless medical inventory management
- **👥 Patient Management**: Comprehensive patient records and appointment scheduling
- **📊 Analytics Dashboard**: Real-time insights and predictive health analytics

## ✨ Key Features

### 🧠 AI-Powered Features
- Intelligent medicine recommendations
- AI health consultation chat
- Symptom analysis and triage
- Predictive health analytics
- Treatment plan optimization

### ⚙️ Core Functionality
- RFID & QR code scanning
- Real-time inventory tracking
- Patient management system
- Appointment scheduling
- Electronic health records

### 💻 Technical Features
- Responsive design for all devices
- Secure user authentication
- Real-time analytics dashboard
- Cloud-based data storage
- Offline capability support

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18.2.0, TypeScript 5.0, Vite 5.4.19 |
| **Styling** | Tailwind CSS, Shadcn/ui, Custom Components |
| **AI Integration** | Google Gemini AI, Natural Language Processing, Machine Learning |
| **Backend** | Firebase, Cloud Functions, Real-time Database |
| **Hardware** | RFID Integration, QR Code Scanner |

## ⚙️ Installation Guide

### Prerequisites

- Node.js (version 16.0 or higher)
- npm or yarn package manager
- Git version control
- Google Gemini AI API key
- Firebase account (optional)

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Punyamittal/shine2.git
   cd shine2
   ```

2. **Install Dependencies**
   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # Application will be available at http://localhost:5173
   ```

## 🔐 Environment Variables Setup

Create a `.env` file in your project root and configure the following variables:

```env
# Google Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (Optional)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id

# Application Configuration
VITE_APP_NAME=MedCHAIN🫀
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=https://api.medchain.com

# Security Settings
VITE_ENCRYPTION_KEY=your_encryption_key
VITE_JWT_SECRET=your_jwt_secret
```

### 🔑 Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key for your project
4. Copy and paste the key into your `.env` file

## 🚀 Usage Guide

### Key Application Routes

| Route | Description |
|-------|-------------|
| `/` | Dashboard & Overview |
| `/consultation` | AI Health Chat |
| `/inventory` | Medical Inventory |
| `/patients` | Patient Management |
| `/analytics` | Reports & Analytics |
| `/profile` | User Profile |

### Quick Start Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run type-check   # TypeScript validation
```

## 🔌 API Integration Examples

### Gemini AI Integration

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getMedicineRecommendation = async (symptoms: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `As a medical AI assistant, analyze these symptoms: ${symptoms}
  Provide medication recommendations with dosage and precautions.
  Always include a disclaimer about consulting healthcare professionals.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};
```

### RFID Integration

```typescript
export const handleRFIDScan = async (rfidData: string) => {
  try {
    // Parse RFID data
    const medicineInfo = parseRFIDData(rfidData);
    
    // Update inventory
    await updateInventory({
      id: medicineInfo.id,
      name: medicineInfo.name,
      quantity: medicineInfo.quantity,
      expiryDate: medicineInfo.expiryDate,
      lastScanned: new Date()
    });
    
    return { success: true, data: medicineInfo };
  } catch (error) {
    console.error('RFID scan error:', error);
    return { success: false, error: error.message };
  }
};
```

## ☁️ Deployment Instructions

### Vercel Deployment

1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

```bash
npm i -g vercel
vercel --prod
```

### Render Deployment

1. Create new Static Site
2. Set build command: `npm run build`
3. Set publish directory: `dist`

### Netlify Deployment

1. Drag & drop dist folder
2. Or connect Git repository
3. Configure redirects for SPA

## 👨‍💻 Development Guidelines

### Code Standards

- ✅ Follow TypeScript best practices
- ✅ Use ESLint and Prettier for consistency
- ✅ Write comprehensive unit tests
- ✅ Document complex functions
- ✅ Follow semantic versioning

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Application pages
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Utility functions
├── types/              # TypeScript definitions
├── assets/             # Static assets
└── styles/             # Global styles
```

## 🤝 Contributing Guidelines

We welcome contributions from healthcare professionals, developers, and AI enthusiasts who share our vision of improving healthcare through technology.

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request
5. Participate in code review

### Contribution Areas

- 🐛 Bug fixes and improvements
- ➕ New feature development
- 📚 Documentation updates
- 🌐 Internationalization
- 🔒 Security enhancements

## 📄 License & Acknowledgments

### MIT License

This project is licensed under the MIT License - see the LICENSE file for details. You are free to use, modify, and distribute this software in accordance with the license terms.

### Acknowledgments

**Technology Partners**
- Google Gemini AI Team
- React Development Team
- Tailwind CSS Community
- Firebase Platform

**Healthcare Advisors**
- Medical professionals worldwide
- Healthcare technology experts
- Open source contributors
- Beta testing community

---

<div align="center">

**MedCHAIN🫀** - Empowering Healthcare Through Intelligent Technology

© 2024 MedCHAIN🫀. Built with ❤️ for the healthcare community.

*Always consult healthcare professionals for medical decisions.*

</div>
