# Utiliser une image Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install
RUN npm rebuild bcrypt --build-from-source


# Copier le reste du code
COPY . .

# Générer les fichiers Prisma
RUN npx prisma generate

# Exposer le port de l'API
EXPOSE 3000
