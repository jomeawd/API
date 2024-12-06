import prisma from '../db.js';

export const getAll = async (sortBy, sortDirection) => {
    let options = {
        select: {
            idReserv: true,
            arrivalDate: true,
            departureDate: true,
            totalPrice: true,
            client: {
                select: {
                    idClient: true,
                    lastName: true,
                    firstName: true,
                },
            },
            room: {
                select: {
                    idRoom: true,
                    number: true,
                },
            },
        },
    };
    if (sortBy) {
        if (!sortDirection) sortDirection = 'asc';
        options.orderBy = {
            [sortBy]: sortDirection,
        };
    }

    return await prisma.reservation.findMany(options);
};

export const getById = async (idReserv) => {
    return await prisma.reservation.findUnique({
        select: {
            idReserv: true,
            arrivalDate: true,
            departureDate: true,
            totalPrice: true,
            client: {
                select: {
                    idClient: true,
                    lastName: true,
                    firstName: true,
                },
            },
            room: {
                select: {
                    idRoom: true,
                    number: true,
                },
            },
        },
        where: {
            idReserv,
        },
    });
};

export const deleteById = async (idReserv) => {
    if (await getById(idReserv)) {
        await prisma.reservation.delete({
            where: {
                idReserv,
            },
        });
        return true;
    }
    return false;
};

export const create = async (idClient, idRoom, arrivalDate, departureDate, totalPrice) => {
    // Vérifier si le client existe
    const clientExists = await prisma.client.findUnique({
        where: { idClient },
    });

    if (!clientExists) {
        return { error: `Le client avec l'ID ${idClient} n'existe pas.` };
    }

    // Vérifier si la chambre existe
    const roomExists = await prisma.room.findUnique({
        where: { idRoom },
    });

    if (!roomExists) {
        return { error: `La chambre avec l'ID ${idRoom} n'existe pas.` };
    }

    // Convertir les dates d'arrivée et de départ en objets Date
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);

    // Vérifier si les dates sont valides
    if (isNaN(arrival) || isNaN(departure)) {
        return { error: 'Les dates fournies ne sont pas valides.' };
    }

    if (arrival >= departure) {
        return { error: 'La date d\'arrivée doit être avant la date de départ.' };
    }

    // Vérifier si la chambre est déjà réservée pour les dates demandées
    const conflictingReservation = await prisma.reservation.findFirst({
        where: {
            idRoom,
            OR: [
                {
                    AND: [
                        { arrivalDate: { lte: departureDate } }, // Une réservation finit après ou le jour même de l'arrivée demandée
                        { departureDate: { gte: arrivalDate } }, // Une réservation commence avant ou le jour même du départ demandé
                    ],
                },
            ],
        },
    });

    if (conflictingReservation) {
        return { 
            error: `La chambre avec l'ID ${idRoom} est déjà réservée entre ${conflictingReservation.arrivalDate} et ${conflictingReservation.departureDate}.` 
        };
    }

    // Mettre à jour le statut de la chambre à 'RESERVED' pour la période de la réservation
    await prisma.room.update({
        where: { idRoom },
        data: {
            status: 'RESERVED',
        },
    });
    // Créer la réservation si toutes les vérifications passent
    const reservation = await prisma.reservation.create({
        data: {
            idClient,
            idRoom,
            arrivalDate,
            departureDate,
            totalPrice,
        },
        select: {
            idReserv: true,
            idClient: true,
            idRoom: true,
            arrivalDate: true,
            departureDate: true,
            totalPrice: true,
        },
    });

    return reservation;
};

export const update = async (idReserv, updatedData) => {
    const updatedReservation = await prisma.reservation.update({
        where: {
            idReserv,
        },
        data: updatedData,
        select: {
            idReserv: true,
            arrivalDate: true,
            departureDate: true,
            totalPrice: true,
            client: {
                select: {
                    idClient: true,
                    lastName: true,
                    firstName: true,
                },
            },
            room: {
                select: {
                    idRoom: true,
                    number: true,
                },
            },
        },
    });

    return updatedReservation;
};
