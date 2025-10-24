#!/bin/bash

# Sofa Customizer Installation Script
echo "🛋️ Setting up Sofa Customizer..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "❌ Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create public directory if it doesn't exist
if [ ! -d "public" ]; then
    mkdir public
fi

# Check if sofa model exists
if [ ! -f "public/sofa.glb" ]; then
    echo "⚠️  No sofa model found in public/sofa.glb"
    echo "📝 Please add your 3D sofa model (.glb or .gltf) to the public folder"
    echo "📖 See public/MODEL_INSTRUCTIONS.md for details"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm start"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "📚 Read README.md for detailed instructions"
echo "🛋️ Happy customizing!"
