import prisma from '../db.js';

// Service pour récupérer toutes les réservations
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
        // Applique les options de tri
        options.orderBy = {
            [sortBy]: sortDirection,
        };
    }

    // Retourne la liste des réservations
    return await prisma.reservation.findMany(options);
};

// Service pour récupérer une réservation spécifique par ID
export const getById = async (idReserv) => {
    // Recherche une réservation par son ID avec les informations du client et de la chambre associée
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

// Service pour supprimer une réservation par son ID
export const deleteById = async (idReserv) => {
    // Vérifie si la réservation existe
    if (await getById(idReserv)) {
        await prisma.reservation.delete({
            where: {
                idReserv,
            },
        });
        return true;
    }
    // Retourne false si la réservation n'existe pas
    return false;
};

// Service pour créer une nouvelle réservation
export const create = async (idClient, idRoom, arrivalDate, departureDate) => {
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
        select: { price: true },
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
                        { arrivalDate: { lte: departureDate } }, 
                        { departureDate: { gte: arrivalDate } },
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

    // Calculer le prix total basé sur le nombre de jours et le prix de la chambre
    const days = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24)); // Nombre de jours
    const totalPrice = roomExists.price * days; 

    // Crée la réservation et retourne ses données
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

// Service pour mettre à jour une réservation existante
export const update = async (idReserv, updatedData) => {
    // Met à jour les données d'une réservation et retourne les informations mises à jour
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

// Service pour récupérer les deux mois avec le plus de réservations dans une année donnée
export const getTopTwoMonthsByYear = async (year) => {
    // Recherche les réservations pour l'année spécifiée
    const reservations = await prisma.reservation.findMany({
        where: {
            AND: [
                { arrivalDate: { gte: `${year}-01-01` } },
                { departureDate: { lte: `${year}-12-31` } }
            ],
        },
        select: {
            arrivalDate: true,
            departureDate: true,
        },
    });

    // Compte les réservations par mois
    const monthsCount = Array(12).fill(0);

    reservations.forEach((reservation) => {
        const arrivalMonth = new Date(reservation.arrivalDate).getMonth(); 
        const departureMonth = new Date(reservation.departureDate).getMonth();

        // Ajouter au compteur pour chaque mois couvert par la réservation
        for (let i = arrivalMonth; i <= departureMonth; i++) {
            monthsCount[i]++;
        }
    });

    // Identifie les deux mois avec le plus de réservations
    const topTwoMonths = monthsCount
        .map((count, index) => ({ month: index + 1, count }))
        // Trier par ordre décroissant des réservations
        .sort((a, b) => b.count - a.count)
        // Prendre les deux premiers mois
        .slice(0, 2);

    return topTwoMonths;
};


