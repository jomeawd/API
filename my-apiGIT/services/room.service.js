import prisma from '../db.js'

// Service pour récupérer toutes les chambres 
export const getAll = async (sortBy, sortDirection) => {
    let options = {
        select: {
            idRoom: true,
            number: true,
            type: true,
            price: true,
            status: true
        },
    };
    if (sortBy) {
        if (!sortDirection) sortDirection = 'asc';
        options.orderBy = {
            // Trie les chambres en fonction des paramètres donnés
            [sortBy]: sortDirection
        };
    }

    // Retourne toutes les chambres avec les options spécifiées
    return await prisma.room.findMany(options);
};

// Service pour récupérer une chambre par son ID
export const getById = async (idRoom) => {
    // Recherche une chambre par son ID avec les champs nécessaires
    return await prisma.room.findUnique({
        select: {
            idRoom: true,
            number: true,
            type: true,
            price: true,
            status: true
        },
        where: {
            idRoom
        },
    });
};

// Service pour supprimer une chambre par son ID
export const deleteById = async (idRoom) => {
    // Vérifie si la chambre existe
    const room = await getById(idRoom);

    if (!room) {
        // Retourne une erreur si la chambre n'existe pas
        return { error: 'Chambre pas existe' };
    }

    // Vérifier si la chambre est associée à une réservation
    const reservation = await prisma.reservation.findFirst({
        where: {
            idRoom: idRoom
        }
    });

    if (reservation) {
        // Empêche la suppression si la chambre est associée à une réservation
        return { error: 'Impossible de supprimer la chambre car elle est actuellement associée à une réservation.' };
    }

    await prisma.room.delete({
        where: {
            idRoom
        },
    });
    return true;
};

// Service pour créer une nouvelle chambre
export const create = async (number, type, price, status) => {
    const existingRoomNumber = await prisma.room.count({
        where: { number },
    });
    if (existingRoomNumber) {
        // Retourne une erreur si le numéro de la chambre existe
        return { error: 'Le numero de la chambre existe déjà.' };
    }
    // Crée une nouvelle chambre avec les données fournies
    const room = await prisma.room.create({
        data: {
            number,
            type,
            price,
            status,
        },
        select: {
            idRoom: true,
            number: true,
            type: true,
            price: true,
            status: true,
        },
    });

    return room;
};
// Service pour mettre à jour une chambre existante
export const update = async (idRoom, updatedData) => {
    // Met à jour la chambre avec les nouvelles données
    const updatedRoom = await prisma.room.update({
        where: { idRoom },
        data: updatedData,
        select: {
            idRoom: true,
            number: true,
            type: true,
            price: true,
            status: true
        }
    });

    // Retourner les informations mises à jour
    return updatedRoom;
};
