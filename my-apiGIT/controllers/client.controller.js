import { getAll, getById, create, update, deleteById, login } from '../services/client.service.js';



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

export const registerClient = async (req, res, next) => {
    const { lastName, firstName, telephone, username, password } = req.body;
    let client;
    try {
        client = await create(lastName, firstName, telephone, username, password)
    } catch (err) {
        return next(err)
    }
    res.json({
        success: true,
        data: client
    })
};

export const loginClient = async (req, res, next) => {
    const { username, password } = req.body
    let token

    try {
        token = await login(username, password)
    } catch (err) {
        return next(err)
    }

    // We will return a success message if the login was successful and the token
    res.json({
        success: true,
        message: 'Login successful',
        token: token
    })
}

export const deleteClient = async (req, res) => {
    const { idClient } = req.params;

    const isDeleted = await deleteById(parseInt(idClient));
    if (isDeleted.error) {
        res.status(400).json({ message: isDeleted.error });
    } else {
        res.status(200).json({ message: `Client avec l'ID ${idClient} supprimé.` });
    }
}

/*
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
*/