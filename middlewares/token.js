const jwt = require('jsonwebtoken');

function checkValidityOfTheToken(req, res, next) {
    const token = req.cookies.token;

    if (token == null){
        res.status(401).send({message: "Vous n'êtes plus connecté"});
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err){
            res.status(401).send({message: "Vous n'êtes plus connecté"});
        }

        req.user = user;

        next();
    })
}

module.exports = { checkValidityOfTheToken }