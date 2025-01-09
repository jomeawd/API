
# API Hotel Management

## Description

Cette API permet de gérer les clients, les chambres, et les réservations pour un hôtel. Elle inclut des fonctionnalités pour la création, la lecture, la mise à jour et la suppression des entités principales, ainsi que des fonctionnalités supplémentaires comme l'authentification des clients et des statistiques.

## Fonctionnalités principales

- **Clients** : Gestion des clients avec des fonctionnalités CRUD et authentification.
- **Chambres** : Gestion des chambres avec des fonctionnalités CRUD.
- **Réservations** : Gestion des réservations, incluant la liaison entre clients et chambres.
- **Statistiques** : Analyse des données comme les mois les plus réservés.

## Technologies utilisées

- **Node.js** : Environnement d'exécution.
- **Express.js** : Framework pour la création de routes et de middlewares.
- **Prisma** : ORM pour interagir avec la base de données SQLite.
- **SQLite** : Base de données légère et embarquée.
- **bcrypt** : Pour le hachage des mots de passe.
- **jsonwebtoken** : Pour l'authentification via des tokens JWT.
- **dotenv** : Pour gérer les variables d'environnement.

## Structure des dossiers

```
.
├── controllers
│   ├── client.controller.js
│   ├── room.controller.js
│   └── reservation.controller.js
├── routers
│   ├── client.router.js
│   ├── room.router.js
│   └── reservation.router.js
├── services
│   ├── client.service.js
│   ├── room.service.js
│   └── reservation.service.js
├── prisma
│   └── schema.prisma
├── middlwears 
│   └── auth.js
├── app.js
├── db.js
├── server.js
├── package.json
└── .env
```

## Installation et lancement

### Prérequis

- Node.js installé sur votre machine.
- Npm
- SQLite
- Prisma CLI
- Un éditeur de code (Visual Studio Code recommandé)
- Accès à un terminal/ligne de commande

### Étapes

1. Clonez le dépôt :
   ```bash
   git clone .. 
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   Créez un fichier `.env` à la racine avec les informations suivantes :
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="votre_secret_jwt"
   BCRYPT_SALT_ROUNDS=10
   ```

4. Lancez Prisma pour initialiser la base de données :
   ```bash
   npx prisma migrate dev --name init
   ```

5. Lancez le serveur :
   ```bash
   npm start
   ```

## Routes

### Clients

- **GET /client** : Récupérer tous les clients.
- **GET /client/:idClient** : Récupérer un client par ID.
- **POST /client/register** : Créer un nouveau client.
- **POST /client/login** : Authentifier un client et générer un token JWT.
- **PUT /client/:idClient** : Mettre à jour un client.
- **DELETE /client/:idClient** : Supprimer un client.

### Chambres

- **GET /room** : Récupérer toutes les chambres.
- **GET /room/:idRoom** : Récupérer une chambre par ID.
- **POST /room** : Créer une nouvelle chambre.
- **PUT /room/:idRoom** : Mettre à jour une chambre.
- **DELETE /room/:idRoom** : Supprimer une chambre.

### Réservations

- **GET /reservation** : Récupérer toutes les réservations.
- **GET /reservation/:idReserv** : Récupérer une réservation par ID.
- **POST /reservation** : Créer une nouvelle réservation.
- **PUT /reservation/:idReserv** : Mettre à jour une réservation.
- **DELETE /reservation/:idReserv** : Supprimer une réservation.

### Autres fonctionnalités

- **GET /client/:idClient/reservation** : Récupérer tous les réservations d'un client.
- **GET /reservation/top-months/{year}** : Récupérer les 2 mois avec le plus des réservations pour une année donnée

##Middlewares

###Auth Middleware

- Le middleware d'authentification vérifie la présence d'un token JWT dans les en-têtes de la requête. Si le token est valide, l'utilisateur est ajouté à la requête pour être utilisé dans les contrôleurs suivants. Si le token est manquant ou invalide, une erreur 401 est renvoyée.

###Admin Middleware

- Le middleware admin vérifie si l'utilisateur a le rôle admin. Si ce n'est pas le cas, une erreur 403 est renvoyée, indiquant que l'accès est réservé aux administrateurs.

## Exemples de requêtes

### 1. Créer un client

**URL** : `POST /client`

**Body** :

```json
{
    "lastName": "Doe",
    "firstName": "John",
    "telephone": "123456789",
    "username": "johndoe",
    "password": "password123"
}
```

### 2. Authentifier un client

**URL** : `POST /client/login`

**Body** :

```json
{
    "username": "johndoe",
    "password": "password123"
}
```

**Réponse** :

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Récupérer les statistiques

**URL** : `GET /reservation/top-months/2024`

**Réponse** :

```json
[
    {
        "month": 7,
        "count": 3
    },
    {
        "month": 4,
        "count": 2
    }
]
```

## Auteur

Créé par **[John Botros](https://github.com/jomeawd)**.
