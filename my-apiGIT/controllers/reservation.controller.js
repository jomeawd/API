import { getAll, getById, create, update, deleteById } from '../services/reservation.service.js';

export const getAllReservations = async (req, res) => {
    const { sortBy, sortDirection } = req.query;
    const reservations = await getAll(sortBy, sortDirection);
    res.json(reservations);
};

export const getReservationById = async (req, res) => {
    const { idReserv } = req.params;
    const reservation = await getById(parseInt(idReserv));

    if (reservation) {
        res.status(200).json(reservation);
    } else {
        res.status(404).json({ message: `Reservation avec l'ID ${idReserv} non trouvé.` });
    }
};

export const updateReservation = async (req, res) => {
    try {
        const { idReserv } = req.params;
        const updatedData = req.body;

        const updatedReservation = await update(parseInt(idReserv), updatedData); // ID en nombre
        if (updatedReservation) {
            res.status(200).json(updatedReservation);
        }
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Reservation non trouvé.' });
    }
};

export const createReservation = async (req, res) => {
    const { idClient, idRoom, arrivalDate, departureDate } = req.body;

    // Vérifier si tous les champs nécessaires sont présents
    if (!idClient || !idRoom || !arrivalDate || !departureDate) {
        return res.status(400).json({ message: 'Tous les champs (idClient, idRoom, arrivalDate, departureDate, totalPrice) sont requis.' });
    }

    const reservation = await create(idClient, idRoom, arrivalDate, departureDate);
    
    if (reservation.error) {
        return res.status(400).json({ message: reservation.error });
    }
    res.status(201).json(reservation);
};

export const deleteReservation = async (req, res) => {
    const { idReserv } = req.params;

    const isDeleted = await deleteById(parseInt(idReserv));
    if (isDeleted) {
        res.status(200).json({ message: `Réservation avec l'ID ${idReserv} supprimée.` });
    } else {
        res.status(404).json({ message: `Réservation avec l'ID ${idReserv} non trouvée.` });
    }
};