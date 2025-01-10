const admin = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.status(403).send({message: "Vous n'êtes pas autorisé à accéder à cette ressource"});
    }

    next();
}

module.exports = admin;