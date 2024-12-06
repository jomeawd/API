import prisma from '../db.js'

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
            [sortBy]: sortDirection
        };
    }

    return await prisma.room.findMany(options);
};

export const getById = async (idRoom) => {
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

export const deleteById = async (idRoom) => {
    const room = await getById(idRoom);

    if (!room) {
        return { error: 'Chambre pas existe' }; // Chambre non trouvée
    }

    // Vérifier si la chambre est associée à une réservation
    const reservation = await prisma.reservation.findFirst({
        where: {
            idRoom: idRoom
        }
    });

    if (reservation) {
        return { error: 'Impossible de supprimer la chambre car elle est actuellement associée à une réservation.' };
    }

    await prisma.room.delete({
        where: {
            idRoom
        },
    });
    return true;
};


export const create = async (number, type, price, status) => {
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

