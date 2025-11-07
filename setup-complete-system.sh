#!/bin/bash

# Complete Sekor-BKC Production System Setup
# This script generates the entire production codebase with multi-content-type support

set -e

echo "🚀 Generating Complete Sekor-BKC Production System..."
echo ""

# Create full directory structure
mkdir -p {frontend,backend,infrastructure,docs}
mkdir -p frontend/{src/{components,pages,hooks,services,utils,types,store,assets,tests},public}
mkdir -p frontend/src/components/{common,auth,reader,creator,admin,content}
mkdir -p frontend/src/pages/{auth,reader,creator,admin}
mkdir -p frontend/src/tests/{unit,integration,e2e}
mkdir -p backend/{src/{controllers,services,models,middleware,utils,types,config,jobs,routes,validators},tests,prisma}
mkdir -p backend/tests/{unit,integration,fixtures}
mkdir -p backend/src/services/{auth,content,user,subscription,email,upload}
mkdir -p infrastructure/{terraform,docker,nginx,scripts}
mkdir -p docs/{api,architecture,deployment,guides}
mkdir -p .github/workflows

echo "✓ Directory structure created"

