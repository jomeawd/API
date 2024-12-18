import express from 'express';
import { getAllClient, getClientById, registerClient, updateClient, deleteClient, loginClient } from '../controllers/client.controller.js';
import authMiddleware, { adminMiddleware } from '../middlewares/auth.js'



// Create a new router
const router = express.Router()

// Route pour récupérer les clients
router.get('/', authMiddleware, adminMiddleware, getAllClient);

// Route pour récupérer un client par son idClient
router.get('/:idClient',getClientById);

// Route pour créer un nouveau client
router.post('/register', registerClient);

router.post('/login', loginClient);

// Route pour mettre à jour un client par son idClient
router.put('/:idClient', updateClient);

// Route pour supprimer un client par son idClient
router.delete('/:idClient', deleteClient);

export default router;