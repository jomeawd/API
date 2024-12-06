import express from 'express';
import { getAllReservations, getReservationById, createReservation, updateReservation, deleteReservation } from '../controllers/reservation.controller.js';

// Create a new router
const router = express.Router();

// Route pour récupérer toutes les réservations
router.get('/', getAllReservations);

// Route pour récupérer une réservation par son idReserv
router.get('/:idReserv', getReservationById);

// Route pour créer une nouvelle réservation
router.post('/', createReservation);

// Route pour mettre à jour une réservation par son idReserv
router.put('/:idReserv', updateReservation);

// Route pour supprimer une réservation par son ation
router.delete('/:idReserv', deleteReservation);

export default router;
