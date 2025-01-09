import { getAll, getById, create, update, deleteById, getTopTwoMonthsByYear} from '../services/reservation.service.js';

// Contrôleur pour récupérer toutes les réservations 
export const getAllReservations = async (req, res) => {
    const { sortBy, sortDirection } = req.query;
    // Appelle le service pour obtenir les réservations
    const reservations = await getAll(sortBy, sortDirection);
    // Retourne les réservations au format JSON
    res.json(reservations);
};

// Contrôleur pour récupérer une réservation spécifique par ID
export const getReservationById = async (req, res) => {
    // Récupère l'ID de la réservation depuis les paramètres de l'URL
    const { idReserv } = req.params;
    const reservation = await getById(parseInt(idReserv));

    if (reservation) {
        // Si la réservation est trouvée, retourne ses données
        res.status(200).json(reservation);
    } else {
        // Si non trouvée, retourne une erreur 404
        res.status(404).json({ message: `Reservation avec l'ID ${idReserv} non trouvé.` });
    }
};

// Contrôleur pour créer une nouvelle réservation
export const createReservation = async (req, res) => {
    const { idClient, idRoom, arrivalDate, departureDate } = req.body;

    // Vérifier si tous les champs nécessaires sont présents
    if (!idClient || !idRoom || !arrivalDate || !departureDate) {
        return res.status(400).json({ message: 'Tous les champs (idClient, idRoom, arrivalDate, departureDate, totalPrice) sont requis.' });
    }

    // Appelle le service pour créer une réservation
    const reservation = await create(idClient, idRoom, arrivalDate, departureDate);
    
    if (reservation.error) {
        // Retourne une erreur si la création échoue
        return res.status(400).json({ message: reservation.error });
    }
    // Retourne la réservation créée avec un statut 201
    res.status(201).json(reservation);
};

// Contrôleur pour mettre à jour une réservation existante
export const updateReservation = async (req, res) => {
    try {
        const { idReserv } = req.params;
        const updatedData = req.body;

        // Met à jour la réservation via le service
        const updatedReservation = await update(parseInt(idReserv), updatedData);
        if (updatedReservation) {
            // Retourne la réservation mise à jour
            res.status(200).json(updatedReservation);
        }
    } catch (error) {
        console.error(error);
        // Si non trouvée, retourne une erreur 404
        res.status(404).json({ message: 'Reservation non trouvé.' });
    }
};

// Contrôleur pour supprimer une réservation
export const deleteReservation = async (req, res) => {
    const { idReserv } = req.params;

    const isDeleted = await deleteById(parseInt(idReserv));
    if (isDeleted) {
        // Confirme la suppression
        res.status(200).json({ message: `Réservation avec l'ID ${idReserv} supprimée.` });
    } else {
        // Retourne une erreur si la réservation n'est pas trouvée
        res.status(404).json({ message: `Réservation avec l'ID ${idReserv} non trouvée.` });
    }
};

export const getTopTwoMonthsByYearController = async (req, res) => {
    // Récupère l'année depuis les paramètres de l'URL
    const { year } = req.params;

    try {
        // Appelle le service pour calculer les mois les plus réservés
        const topTwoMonths = await getTopTwoMonthsByYear(year);
        // Retourne les deux mois les plus réservés
        res.status(200).json(topTwoMonths);
    } catch (error) {
        // Retourne une erreur 500 en cas de problème
        res.status(500).json({ message: 'Erreur lors du calcul des mois les plus réservés', error: error.message });
    }
};
