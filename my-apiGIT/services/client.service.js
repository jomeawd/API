import prisma from '../db.js'

export const getAll = async(sortBy, sortDirection) => {
    let options = {
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true
        }
    }
    if (sortBy) {
        if (!sortDirection) sortDirection = 'asc'
        options.orderBy = {
            [sortBy]: sortDirection
        }
    }

    return await prisma.client.findMany(options)
}

export const getById = async (idClient) => {
    return await prisma.client.findUnique({
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true
        },
        where: {
            idClient
        }
    });
};


export const deleteById = async (idClient) => {
    const client = await getById(idClient);

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
        return { error: 'Impossible de supprimer le client car il est actuellement associé à une réservation.' };
    }

    await prisma.client.delete({
        where: {
            idClient
        },
    });
    return true;
};



export const create = async (lastName, firstName, telephone) => {
    const client = await prisma.client.create({
        data: {
            lastName,
            firstName,
            telephone
        },
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true
        }
    });

    return client;
};

export const update = async (idClient, updatedData) => {
    // Vérifier si le client existe avant de le mettre à jour
    const existingClient = await getById(idClient);
    // Mettre à jour le client avec les nouvelles données
    const updatedClient = await prisma.client.update({
        where: {
            idClient
        },
        data: updatedData,
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true
        }
    });

    return updatedClient; // Retourner les informations mises à jour
};