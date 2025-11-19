#!/usr/bin/env bash
set -euo pipefail

echo "Installing backend dependencies..."
npm --prefix backend ci --silent

echo "Starting backend..."
npm --prefix backend start