#!/bin/bash
set -e

echo "🔍 SEKOR-BKC Backend Validation"
echo "================================"

echo ""
echo "📦 Installing dependencies..."
npm install --silent

echo ""
echo "🔨 Generating Prisma client..."
npm run db:generate

echo ""
echo "🏗️  Building TypeScript..."
npm run build

echo ""
echo "✅ Build successful!"
echo ""
echo "📚 Project structure:"
tree -L 2 -I 'node_modules|dist' || ls -R

echo ""
echo "🎉 Validation complete!"
echo ""
echo "To start the server:"
echo "  npm run dev      # Development mode"
echo "  npm start        # Production mode"
