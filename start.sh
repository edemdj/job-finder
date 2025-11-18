#!/usr/bin/env bash
set -euo pipefail

# Se placer dans le dossier backend et démarrer l'app
cd backend

echo "Installing backend dependencies..."
# utilise npm ci si tu as package-lock.json, sinon npm install
npm ci --silent

echo "Starting backend..."
# lance le script "start" défini dans backend/package.json
npm start