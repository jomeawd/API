import { getAll, getById, create, update, deleteById } from '../services/client.service.js';


export const getAllClient = async (req, res) => {
    const { sortBy, sortDirection } = req.query;
    const clients = await getAll(sortBy, sortDirection);
    res.json(clients);
};

export const getClientById = async (req, res) => {
    const { idClient } = req.params;
    const client = await getById(parseInt(idClient));

    if (client) {
        res.status(200).json(client);
    } else {
        res.status(404).json({ message: `Client avec l'ID ${idClient} non trouvé.` });
    }
};


export const updateClient = async (req, res) => {
    try {
        const { idClient } = req.params;
        const updatedData = req.body;

        const updatedClient = await update(parseInt(idClient), updatedData); // ID en nombre
        if (updatedClient) {
            res.status(200).json(updatedClient);
        }
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Client non trouvé.' });
    }
};

export const createClient = async (req, res) => {
    const { lastName, firstName, telephone } = req.body;
    if (!lastName || !firstName || !telephone) {
        return res.status(400).json({ message: 'Les champs lastName, firstName et telephone sont requis.' });
    }

    const client = await create(lastName, firstName, telephone);
    res.status(201).json(client);
};

export const deleteClient = async (req, res) => {
    const { idClient } = req.params;

    const isDeleted = await deleteById(parseInt(idClient));
    if (isDeleted.error) {
        res.status(400).json({ message: isDeleted.error });
    } else {
        res.status(200).json({ message: `Client avec l'ID ${idClient} supprimé.` });
    }
}
