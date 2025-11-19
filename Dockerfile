FROM node:20-alpine

WORKDIR /app

# Copier package.json/package-lock du backend d'abord (pour utiliser le cache Docker)
COPY backend/package*.json ./backend/

# Installer les dépendances du backend à l'intérieur du conteneur
RUN npm --prefix backend ci --silent

# Copier le reste du projet
COPY . .

ENV NODE_ENV=production

# Démarrer le backend
CMD ["npm", "--prefix", "backend", "start"]