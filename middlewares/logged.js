const logged = (req, res, next) => {
    if (!req?.session.userid) {
        return res.status(403).send({message: "Vous n'êtes plus connecté"});
    }

    next();
}

module.exports = logged;