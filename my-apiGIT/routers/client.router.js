import express from 'express';
import { getAllClient, getClientById, registerClient, updateClient, deleteClient, loginClient, getReservationsByClientId } from '../controllers/client.controller.js';
import authMiddleware, { adminMiddleware } from '../middlewares/auth.js'



// Créer un nouvel router
const router = express.Router()

// Route pour récupérer les clients
router.get('/', authMiddleware, adminMiddleware, getAllClient);

// Route pour récupérer un client par son idClient
router.get('/:idClient', authMiddleware, adminMiddleware, getClientById);

// Route pour créer un nouveau client
router.post('/register', registerClient);

// Route pour permettre aux clients de se connecter
router.post('/login', loginClient);

// Route pour mettre à jour un client par son idClient
router.put('/:idClient', authMiddleware, adminMiddleware, updateClient);

// Route pour supprimer un client par son idClient
router.delete('/:idClient', authMiddleware, adminMiddleware, deleteClient);

// Route pour obtenir toutes les réservations d'un client
router.get('/:idClient/reservation', authMiddleware, adminMiddleware, getReservationsByClientId);


export default router;