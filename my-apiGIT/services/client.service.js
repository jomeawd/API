import prisma from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Service pour récupérer tous les clients
export const getAll = async(sortBy, sortDirection) => {
    let options = {
        // Champs à inclure dans la réponse
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true,
            username: true,
            role: true
        }
    }
    if (sortBy) {
        if (!sortDirection) sortDirection = 'asc'
        // Ajoute les options de tri
        options.orderBy = {
            [sortBy]: sortDirection
        }
    }

    // Requête pour récupérer les clients
    return await prisma.client.findMany(options)
}

// Service pour récupérer un client par son ID
export const getById = async (idClient) => {
    // Recherche un client par ID en sélectionnant des champs spécifiques
    return await prisma.client.findUnique({
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true,
            role: true
        },
        where: {
            idClient
        }
    });
};

// Service pour supprimer un client par son ID
export const deleteById = async (idClient) => {
    const client = await getById(idClient);

    // Vérifie si le client existe
    if (!client) {
        return { error: 'Client Non Trouvé' };
    }

    // Vérifier si le client a des réservations
    const reservation = await prisma.reservation.findFirst({
        where: {
            idClient: idClient
        }
    });

    if (reservation) {
        // Retourne une erreur si des réservations sont associées
        return { error: 'Impossible de supprimer le client car il est actuellement associé à une réservation.' };
    }

    // Supprime le client et retourne true en cas de succès
    await prisma.client.delete({
        where: {
            idClient
        },
    });
    return true;
};

// Service pour créer un nouveau client
export const create = async (lastName, firstName, telephone, username, password, role = "user") => {
    // Vérification si le username existe déjà
    const existingUser = await prisma.client.count({
        where: { username },
    });
    if (existingUser) {
        // Retourne une erreur si le nom d'utilisateur existe déjà
        return { error: 'Le nom d\'utilisateur existe déjà.' };
    }

    // Hachage du mot de passe
    const encryptedPassword = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || 10));

    // Création du client
    const client = await prisma.client.create({
        data: {
            lastName, 
            firstName, 
            telephone, 
            username,
            password: encryptedPassword,
            role,
        },
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true,
            username: true,
            role: true
        },
    });

    return client;
};

// Service pour gérer la connexion d'un client
export const login = async (username, password) => {
    // Recherche un client par nom d'utilisateur
    const client = await prisma.client.findFirst({
        where: {
            username
        }
    })

    // Retourne une erreur si le client n'existe pas
    if (!client) throw new Error('Client not found')

    // Vérifie si le mot de passe est incorrect
    if (!bcrypt.compareSync(password, client.password)) throw new Error('Invalid password')

    // Génère un token JWT pour authentifier le client
    const token = jwt.sign({
        id: client.id,
        username: client.username,
        role: client.role
    }, process.env.JWT_SECRET, {
        // Le token expire dans 1 heure
        expiresIn: '1h'
    })

    return token
}

// Service pour mettre à jour les données d'un client
export const update = async (idClient, updatedData) => {
    // Met à jour les données du client dans la base de données
    const updatedClient = await prisma.client.update({
        where: {
            idClient
        },
        // Données à mettre à jour
        data: updatedData,
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true,
            role: true
        }
    });

    // Retourner les informations mises à jour
    return updatedClient;
};

// Service pour récupérer les réservations d'un client par ID
export const getReservationsById = async (idClient) => {
    // Recherche les réservations associées à un client
    return await prisma.reservation.findMany({
        where: {
            idClient: parseInt(idClient), // Vérifie que l'id du client correspond
        },
        // Champs des réservations à inclure
        select: {
            idReserv: true,
            arrivalDate: true,
            departureDate: true,
            totalPrice: true,
            room: {
                // Inclut les informations sur la chambre associée
                select: {
                    idRoom: true,
                    number: true,
                    type: true,
                    price: true,
                },
            },
        },
    });
};