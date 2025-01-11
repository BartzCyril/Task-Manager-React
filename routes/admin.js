const express = require('express');
const router = express.Router();
const users = require('../models/user');
const tasks = require('../models/task')
const loggedMiddleware = require('../middlewares/logged');
const adminMiddleware = require('../middlewares/admin');
const {checkValidityOfTheToken} = require('../middlewares/token');

router.get('/', [loggedMiddleware, checkValidityOfTheToken, adminMiddleware], (req, res) => {
    const userId = req.session.userid;
    const username = req.session.username;
    users.getAllUsers((err, users) => {
        if (err) {
            res.status(500).send({message: `Une erreur est survenue lors de la récupération des utilisateurs ${err.message}`});
            return;
        }
        const filteredUsers = users.filter(user => {
            if ((username === 'alex' || username === 'cyril') && (user.username === 'alex' || user.username === 'cyril')) {
                return false;
            }
            return user.id !== userId && user.is_admin !== 1;
        });
        res.status(200).send({data: filteredUsers});
    });
});

router.get('/tasks/user/:id', [loggedMiddleware, checkValidityOfTheToken, adminMiddleware], (req, res) => {
    const userId = req.params.id;
    tasks.getAllTaskByUserId(userId, (err, tasks) => {
        if (err) {
            res.status(500).send({message: `Une erreur est survenue lors de la récupération des tâches ${err.message}`});
            return;
        }
        res.status(200).send({data: tasks});
    });
});

router.delete('/:id', [loggedMiddleware, checkValidityOfTheToken, adminMiddleware], (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).send({message: 'Id is required'});
        return;
    }

    users.deleteUser(id, (err, result) => {
        if (err) {
            res.status(500).send({message: `Une erreur est survenue lors de la suppression de l'utilisateur ${err.message}`});
            return;
        }
        res.status(200).send({message: `Utilisateur #${id} supprimé avec succès`});
    });
});

module.exports = router;
