const jwt = require('jsonwebtoken');

function checkValidityOfTheToken(req, res, next) {
    const token = req.cookies.token;

    if (token == null){
        res.status(401).send({message: 'Vous n\'avez pas les droits pour accéder à cette page'});
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err){
            res.status(403).send({message: 'Vous n\'avez pas les droits pour accéder à cette page'});
        }

        req.user = user;

        next();
    })
}

module.exports = { checkValidityOfTheToken }