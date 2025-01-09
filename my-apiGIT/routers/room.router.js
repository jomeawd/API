import express from 'express';
import { getAllRooms, getRoomById, deleteRoom, createRoom, updateRoom } from '../controllers/room.controller.js';
import authMiddleware, { adminMiddleware } from '../middlewares/auth.js'

// Créer un nouvel router
const router = express.Router();

// Route pour récupérer toutes les chambres
router.get('/', authMiddleware, adminMiddleware, getAllRooms);

// Route pour récupérer une chambre par son idRoom
router.get('/:idRoom',authMiddleware, adminMiddleware,  getRoomById);

// Route pour supprimer une chambre par son idRoom
router.delete('/:idRoom', authMiddleware, adminMiddleware, deleteRoom);

// Route pour créer une nouvelle chambre
router.post('/', authMiddleware, adminMiddleware, createRoom);

// Route pour mettre à jour une chambre
router.put('/:idRoom',  authMiddleware, adminMiddleware, updateRoom);

export default router;
