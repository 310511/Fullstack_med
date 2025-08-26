#!/bin/bash
set -e

echo "🚀 Starting build process for shine2..."

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "📦 Installing Node.js dependencies..."
yarn install

echo "🔨 Building frontend..."
yarn build

echo "✅ Build completed successfully!"
