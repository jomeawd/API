import { getAll, getById, create, update, deleteById, login, getReservationsById } from '../services/client.service.js';


// Contrôleur pour récupérer tous les clients
export const getAllClient = async (req, res) => {
    const { sortBy, sortDirection } = req.query;
    // Appelle le service pour obtenir les clients triés
    const clients = await getAll(sortBy, sortDirection);
    res.json(clients);
};

// Contrôleur pour récupérer un client spécifique par son Identifiant
export const getClientById = async (req, res) => {
    // Récupère l'ID du client depuis les paramètres de l'URLv
    const { idClient } = req.params;
    const client = await getById(parseInt(idClient));

    if (client) {
        // Si le client est trouvé, retourne ses données
        res.status(200).json(client);
    } else {
        // Si non trouvé, retourne une erreur 404
        res.status(404).json({ message: `Client avec l'ID ${idClient} non trouvé.` });
    }
};

// Contrôleur pour mettre à jour un client existant
export const updateClient = async (req, res) => {
    try {
        // Récupère l'ID du client depuis les paramètres de l'URL
        const { idClient } = req.params;
        // Récupère les nouvelles données depuis le corps de la requête
        const updatedData = req.body;

        // Met à jour le client via le service
        const updatedClient = await update(parseInt(idClient), updatedData);
        if (updatedClient) {
            // Retourne le client mis à jour
            res.status(200).json(updatedClient);
        }
    } catch (error) {
        console.error(error);
        // Retourne une erreur 404 si le client n'est pas trouvé
        res.status(404).json({ message: 'Client non trouvé.' });
    }
};

// Contrôleur pour enregistrer un nouveau client
export const registerClient = async (req, res, next) => {
    const { lastName, firstName, telephone, username, password, role } = req.body;

    // Vérifie que tous les champs requis sont présents
    if (!lastName || !firstName || !telephone || !username || !password || !role) {
        return res.status(400).json({ message: 'Les champs lastName, firstName, telephone, username, password et role sont requis.' });
    }
    let client;
    try {
        // Appelle le service pour créer un client
        client = await create(lastName, firstName, telephone, username, password, role)
    } catch (err) {
        // Passe l'erreur au middleware de gestion des erreurs
        return next(err)
    }
    res.json({
        success: true,
        // Retourne les données du client créé
        data: client
    })
};

// Contrôleur pour gérer la connexion d'un client
export const loginClient = async (req, res, next) => {
    const { username, password } = req.body
    let token

    try {
        // Appelle le service pour vérifier les identifiants et générer un token
        token = await login(username, password)
    } catch (err) {
        // Vérifier le type d'erreur et renvoyer un message spécifique
        if (err.message == 'Client not found') {
            // Retourne une erreur 404 si le client n'est pas trouvé
            return res.status(404).json({
                success: false,
                message: 'Nom d\'utilisateur introuvable'
            })
        } else if (err.message == 'Invalid password') {
            // Retourne une erreur 401 si le mot de passe n'est pas correcte
            return res.status(401).json({
                success: false,
                message: 'Mot de passe invalide'
            })
        }

        // Si une autre erreur se produit, renvoyer l'erreur générique
        return next(err)
    }

    // Si le login réussit, renvoyer le token
    res.json({
        success: true,
        message: 'Login successful',
        token: token
    })
}

// Contrôleur pour supprimer un client
export const deleteClient = async (req, res) => {
    const { idClient } = req.params;

    const isDeleted = await deleteById(parseInt(idClient));
    if (isDeleted.error) {
        // Retourne une erreur si la suppression échoue
        res.status(400).json({ message: isDeleted.error });
    } else {
        // Confirme la suppression
        res.status(200).json({ message: `Client avec l'ID ${idClient} supprimé.` });
    }
}

// Contrôleur pour récupérer les réservations d'un client spécifique
export const getReservationsByClientId = async (req, res) => {
    const { idClient } = req.params;

    try {
        const reservations = await getReservationsById(idClient);
        if (!reservations || reservations.length === 0) {
            // Si aucune réservation, retourne une erreur 404
            return res.status(404).json({ message: 'Aucune réservation trouvée pour ce client.' });
        }
        // Retourne les réservations trouvées
        return res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        // Retourne une erreur 500 en cas de problème
        return res.status(500).json({ message: 'Erreur serveur.' });
    }
};
