import { getAll, getById, deleteById, create } from '../services/room.service.js';

export const getAllRooms = async (req, res) => {
    const { sortBy, sortDirection } = req.query;
    const rooms = await getAll(sortBy, sortDirection);
    res.json(rooms);
};

export const getRoomById = async (req, res) => {
    const { idRoom } = req.params;
    const room = await getById(parseInt(idRoom));

    if (room) {
        res.status(200).json(room);
    } else {
        res.status(404).json({ message: `Chambre avec l'ID ${idRoom} non trouvée.` });
    }
};

export const createRoom = async (req, res) => {
    const { number, type, price, status } = req.body;
    if (!number || !type || !price || !status) {
        return res.status(400).json({ message: 'Les champs number, type, price et status sont requis.' });
    }

    const room = await create(number, type, price, status);
    res.status(201).json(room);
};

export const deleteRoom = async (req, res) => {
    const { idRoom } = req.params;

    const isDeleted = await deleteById(parseInt(idRoom));
    if (isDeleted.error) {
        res.status(400).json({ message: isDeleted.error });
    } else {
        res.status(200).json({ message: `Chambre avec l'ID ${idRoom} supprimée.` });
    }
};
