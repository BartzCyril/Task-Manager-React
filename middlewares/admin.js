const admin = (req, res, next) => {
    if (req.session.role !== 'admin' && req.session.role !== 'superAdmin') {
        return res.status(403).send({message: "Vous n'êtes pas autorisé à accéder à cette ressource"});
    }

    next();
}

module.exports = admin;