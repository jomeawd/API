import { getAll, getById, deleteById, create, update } from '../services/room.service.js';

// Contrôleur pour récupérer toutes les chambres
export const getAllRooms = async (req, res) => {
    const { sortBy, sortDirection } = req.query;
    const rooms = await getAll(sortBy, sortDirection);
    // Envoi de la liste des chambres au client
    res.json(rooms);
};

// Contrôleur pour récupérer une chambre spécifique par ID
export const getRoomById = async (req, res) => {
    const { idRoom } = req.params;
    const room = await getById(parseInt(idRoom));

    if (room) {
        // Si la chambre est trouvée, retourne ses données
        res.status(200).json(room);
    } else {
        // Si non trouvée, retourne une erreur 404
        res.status(404).json({ message: `Chambre avec l'ID ${idRoom} non trouvée.` });
    }
};

// Contrôleur pour créer une nouvelle chambre
export const createRoom = async (req, res) => {
    const { number, type, price, status } = req.body;
    // Vérifier si tous les champs nécessaires sont présents
    if (!number || !type || !price || !status) {
        return res.status(400).json({ message: 'Les champs number, type, price et status sont requis.' });
    }

    const room = await create(number, type, price, status);
    // Retourne la chambre créée avec un statut 201
    res.status(201).json(room);
};

// Contrôleur pour supprimer une chambre
export const deleteRoom = async (req, res) => {
    const { idRoom } = req.params;

    const isDeleted = await deleteById(parseInt(idRoom));
    if (isDeleted.error) {
        // Confirme la suppression
        res.status(400).json({ message: isDeleted.error });
    } else {
        // Retourne une erreur si la chambre n'est pas trouvée
        res.status(200).json({ message: `Chambre avec l'ID ${idRoom} supprimée.` });
    }
};

// Contrôleur pour mettre à jour une chambre existante
export const updateRoom = async (req, res) => {
    try {
        const { idRoom } = req.params;
        const updatedData = req.body;

        // Met à jour la chambre via le service
        const updatedRoom = await update(parseInt(idRoom), updatedData);
        if (updatedRoom) {
            // Retourne la chambre mise à jour
            res.status(200).json(updatedRoom);
        }
    } catch (error) {
        console.error(error);
        // Si non trouvée, retourne une erreur 404
        res.status(404).json({ message: 'Chambre non trouvée.' });
    }
};
