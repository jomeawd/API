import prisma from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const getAll = async(sortBy, sortDirection) => {
    let options = {
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true
        }
    }
    if (sortBy) {
        if (!sortDirection) sortDirection = 'asc'
        options.orderBy = {
            [sortBy]: sortDirection
        }
    }

    return await prisma.client.findMany(options)
}

export const getById = async (idClient) => {
    return await prisma.client.findUnique({
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true
        },
        where: {
            idClient
        }
    });
};


export const deleteById = async (idClient) => {
    const client = await getById(idClient);

    if (!client) {
        return { error: 'Client Non Trouvé' };
    }

    // Vérifier si le client a des réservations
    const reservation = await prisma.reservation.findFirst({
        where: {
            idClient: idClient
        }
    });

    if (reservation) {
        return { error: 'Impossible de supprimer le client car il est actuellement associé à une réservation.' };
    }

    await prisma.client.delete({
        where: {
            idClient
        },
    });
    return true;
};



/*export const create = async (lastName, firstName, telephone) => {
    const client = await prisma.client.create({
        data: {
            lastName,
            firstName,
            telephone
        },
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true
        }
    });

    return client;
};*/

export const create = async (lastName, firstName, telephone, username, password, role = "user") => {
    // Vérification si le username existe déjà
    const existingUser = await prisma.client.count({
        where: { username },
    });
    if (existingUser > 0) throw new Error('Le nom d\'utilisateur existe déjà.');

    // Hachage du mot de passe
    const encryptedPassword = bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || 10));

    // Création du client
    const client = await prisma.client.create({
        data: {
            lastName, 
            firstName, 
            telephone, 
            username,
            password: encryptedPassword,
            role,
        },
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true,
            username: true,
            role: true,
        },
    });

    return client;
};

export const login = async (username, password) => {
    const client = await prisma.client.findFirst({
        where: {
            username
        }
    })

    if (!client) throw new Error('Client not found')

    if (!bcrypt.compareSync(password, client.password)) throw new Error('Invalid password')

    // Generate a token here
    const token = jwt.sign({
        id: client.id,
        username: client.username,
        role: client.role
    }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })

    return token
}

export const update = async (idClient, updatedData) => {
    // Vérifier si le client existe avant de le mettre à jour
    const existingClient = await getById(idClient);
    // Mettre à jour le client avec les nouvelles données
    const updatedClient = await prisma.client.update({
        where: {
            idClient
        },
        data: updatedData,
        select: {
            idClient: true,
            lastName: true,
            firstName: true,
            telephone: true
        }
    });

    return updatedClient; // Retourner les informations mises à jour
};