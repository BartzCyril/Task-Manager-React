const express = require('express');
const router = express.Router();
const users = require('../models/user');
const loggedMiddleware = require('../middlewares/logged');
const adminMiddleware = require('../middlewares/admin');
const { checkValidityOfTheToken } = require('../middlewares/token');

router.get('/', [loggedMiddleware, checkValidityOfTheToken, adminMiddleware], (req, res) => {
    const userId = req.session.userid;

    users.getAllUsers((err, users) => {
        if(err){
            res.status(500).send({message : `Une erreur est survenue lors de la récupération des utilisateurs ${err.message}`});
            return;
        }
        res.status(200).send({data: users.filter(user => user.id !== userId)});
    })
})

router.delete('/:id', [loggedMiddleware, checkValidityOfTheToken, adminMiddleware], (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).send({message: 'Id is required'});
        return;
    }

    users.deleteUser(id, (err, result) => {
        if(err){
            res.status(500).send({message: `Une erreur est survenue lors de la suppression de l'utilisateur ${err.message}`});
            return;
        }
        res.status(200).send({message: `Utilisateur #${id} supprimé avec succès`});
    })
})

module.exports = router;
