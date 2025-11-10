#!/usr/bin/env bash
# reinstall.sh
# Nettoie et réinstalle les dépendances pour frontend et backend (Node/npm),
# crée tsconfig.node.json dans frontend si manquant et crée un .env minimal si absent.
#
# Usage:
#   1) Place ce fichier à la racine du repo (ex: /Users/macbook/job-finder/reinstall.sh)
#   2) Rends-le exécutable: chmod +x reinstall.sh
#   3) Exécute: ./reinstall.sh
#
# IMPORTANT: sauvegarde manuellement tout fichier .env ou config sensible avant d'exécuter.

set -euo pipefail

ROOT_DIR="$(pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_DIR="$ROOT_DIR/backend"

echo "=== Réinstallation: vérification des prérequis ==="
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js introuvable. Installe Node >= 16 et relance."
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "npm introuvable. Installe npm et relance."
  exit 1
fi

echo "Node: $(node -v)"
echo "npm:  $(npm -v)"
echo

clean_and_install() {
  DIR="$1"
  if [ ! -d "$DIR" ]; then
    echo "Dossier $DIR introuvable — skip."
    return
  fi

  echo "=== Traitement de $DIR ==="
  cd "$DIR"

  # Sauvegarde .env existant
  if [ -f ".env" ]; then
    echo "Sauvegarde .env -> .env.bak.$(date +%s)"
    cp .env ".env.bak.$(date +%s)" || true
  fi

  echo "Suppression de node_modules et fichiers lock si présents..."
  rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml

  echo "Nettoyage du cache npm (silencieux)..."
  npm cache clean --force >/dev/null 2>&1 || true

  echo "Installation des dépendances dans $DIR..."
  npm install

  echo "Installation terminée dans $DIR"
  cd "$ROOT_DIR"
  echo
}

# Backend
clean_and_install "$BACKEND_DIR"

# Frontend
clean_and_install "$FRONTEND_DIR"

# Création safe de tsconfig.node.json dans frontend si manquant
if [ -d "$FRONTEND_DIR" ]; then
  if [ ! -f "$FRONTEND_DIR/tsconfig.node.json" ]; then
    cat > "$FRONTEND_DIR/tsconfig.node.json" <<'JSON'
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
JSON
    echo "Créé: $FRONTEND_DIR/tsconfig.node.json"
  else
    echo "$FRONTEND_DIR/tsconfig.node.json existe déjà — aucun changement."
  fi

  # Création d'un .env minimal si absent
  if [ ! -f "$FRONTEND_DIR/.env" ]; then
    cat > "$FRONTEND_DIR/.env" <<'ENV'
# variables d'environnement pour Vite (ne pas mettre de secrets ici)
VITE_API_BASE=http://localhost:5000
ENV
    echo "Créé: $FRONTEND_DIR/.env (avec VITE_API_BASE=http://localhost:5000)"
  else
    echo "$FRONTEND_DIR/.env existe déjà — aucune modification."
  fi

  # Créer vite.config.ts minimal si absent (ne pas écraser s'il existe)
  if [ ! -f "$FRONTEND_DIR/vite.config.ts" ]; then
    cat > "$FRONTEND_DIR/vite.config.ts" <<'TS'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  server: {
    host: true,
    port: 5173,
    open: false,
    hmr: { protocol: 'ws', host: 'localhost', port: 5173 }
  },
  base: '/'
})
TS
    echo "Créé: $FRONTEND_DIR/vite.config.ts (config Vite minimal)"
  else
    echo "$FRONTEND_DIR/vite.config.ts existe déjà — aucune modification."
  fi
fi

echo
echo "=== Vérifications finales ==="
echo "Frontend dossier: $FRONTEND_DIR"
echo "Backend dossier:  $BACKEND_DIR"
echo
echo "Pour démarrer le backend (dans un terminal séparé) :"
echo "  cd $BACKEND_DIR && npm run dev"
echo
echo "Pour démarrer le frontend (dans un autre terminal) :"
echo "  cd $FRONTEND_DIR && npm run dev"
echo "Si HMR/WebSocket pose problème, essaye : npx vite --host"
echo
echo "Si tu utilises des variables sensibles dans .env, restaure depuis les sauvegardes .env.bak.* si nécessaire."
echo
echo "=== Terminé ==="