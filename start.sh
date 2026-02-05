#!/usr/bin/env bash
set -e

echo "Building frontend..."
cd frontend
npm ci --legacy-peer-deps || npm install --legacy-peer-deps
npm run build
cd ..

echo "Copying frontend build to backend/static..."
rm -rf backend/static || true
mkdir -p backend/static
cp -r frontend/dist/* backend/static/

echo "Installing Python dependencies..."
python -m pip install --user -r backend/requirements.txt

PORT=${PORT:-8000}

echo "Starting Uvicorn on port $PORT..."
python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT
