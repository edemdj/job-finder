# Utilise une image officielle Node.js
FROM node:20-alpine

# Dossier de travail
WORKDIR /app

# Copier seulement package.json + package-lock pour utiliser le cache docker layer
COPY backend/package*.json ./backend/

# Installer les dépendances du backend
RUN npm --prefix backend ci --silent

# Copier le reste du projet
COPY . .

# Variables d'environnement par défaut (peuvent être remplacées par la plateforme)
ENV NODE_ENV=production

# Commande de démarrage : lance le start script dans backend
CMD ["npm", "--prefix", "backend", "start"]