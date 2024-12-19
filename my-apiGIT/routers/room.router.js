import express from 'express';
import { getAllRooms, getRoomById, deleteRoom, createRoom } from '../controllers/room.controller.js';
import authMiddleware, { adminMiddleware } from '../middlewares/auth.js'

// Create a new router
const router = express.Router();

// Route pour récupérer toutes les chambres
router.get('/', authMiddleware, adminMiddleware, getAllRooms);

// Route pour récupérer une chambre par son idRoom
router.get('/:idRoom',authMiddleware, adminMiddleware,  getRoomById);

// Route pour supprimer une chambre par son idRoom
router.delete('/:idRoom', authMiddleware, adminMiddleware, deleteRoom);

// Route pour créer une nouvelle chambre
router.post('/', authMiddleware, adminMiddleware, createRoom);

export default router;
