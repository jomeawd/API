import jwt from 'jsonwebtoken'

// Middleware pour vérifier le token JWT
export default (req, res, next) => {
    // Récupère le token dans les headers
    let token = req.headers?.authorization

    if (!token) {
        // Retourne une erreur 401 si aucun token n'est fourni
        return res.status(401).json({ message: 'No token provided' })
    }

    // Supprime la partie "Bearer " du token (par convention)
    token = token.replace('Bearer ', '')

    try {
        // Vérifie le token avec la clé secrète, renvoie une erreur si invalide
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Ajoute les infos du client (user) au req pour l'utiliser dans le contrôleur suivant
        req.user = decoded
    } catch {
        // Retourne une erreur 401 si le token est invalide
        return res.status(401).json({ message: 'Invalid token' })
    }

    next()
}

// Middleware pour vérifier si le rôle est admin
export const adminMiddleware = (req, res, next) => {
    // Vérifie si le rôle du client n'est pas admin
    if (req.user.role !== 'admin') {
        // Retourne une erreur 403 si l'accès est refusé
        return res.status(403).json({ message: "Accès refusé. Admin requis." });
    }
    next();
};
