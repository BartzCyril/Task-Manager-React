const admin = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.status(403).send({message: 'Vous n\'avez pas les droits pour accéder à cette page'});
    }

    next();
}

module.exports = admin;