import express from 'express';
import { getAllRooms, getRoomById, deleteRoom, createRoom } from '../controllers/room.controller.js';

// Create a new router
const router = express.Router();

// Route pour récupérer toutes les chambres
router.get('/', getAllRooms);

// Route pour récupérer une chambre par son idRoom
router.get('/:idRoom', getRoomById);

// Route pour supprimer une chambre par son idRoom
router.delete('/:idRoom', deleteRoom);

// Route pour créer une nouvelle chambre
router.post('/', createRoom);

export default router;
