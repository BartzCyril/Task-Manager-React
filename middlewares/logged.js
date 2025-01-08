const logged = (req, res, next) => {
    if (!req?.session.userid) {
        return res.status(403).send({message: 'Vous n\'avez pas les droits pour accéder à cette page'});
    }

    next();
}

module.exports = logged;