const express = require('express');
const router = express.Router();
const users = require('../models/user');
const tasks = require('../models/task')
const loggedMiddleware = require('../middlewares/logged');
const adminMiddleware = require('../middlewares/admin');
const superAdminMiddleware = require('../middlewares/superAdmin');
const {checkValidityOfTheToken} = require('../middlewares/token');

router.get('/', [loggedMiddleware, checkValidityOfTheToken, adminMiddleware], (req, res) => {
    const role = req.session.role;
    const id = req.session.userid;
    users.getAllUsers((err, users) => {
        if (err) {
            res.status(500).send({message: `Une erreur est survenue lors de la récupération des utilisateurs ${err.message}`});
            return;
        }
        const filteredUsers = users.filter(user => {
            if (role === 'superAdmin') {
                return user.role !== 'superAdmin';
            } else if (role === 'admin') {
                return user.role !== 'superAdmin' && user.role !== 'admin' && user.id !== id;
            }
            else {
                return user.role !== 'superAdmin' && user.id !== id;
            }
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

router.put('/user/role', [loggedMiddleware, checkValidityOfTheToken, adminMiddleware, superAdminMiddleware], (req, res) => {
    const id = req.body.id;
    const role = req.body.role;

    if (!id) {
        res.status(400).send({message: 'Id is required'});
        return;
    }

    if (!role) {
        res.status(400).send({message: 'Role is required'});
        return;
    }

    users.updateRole(id, role, (err, result) => {
        if (err) {
            res.status(500).send({message: `Une erreur est survenue lors de la modification du rôle de l'utilisateur ${err.message}`});
            return;
        }
        res.status(200).send({message: `Rôle de l'utilisateur #${id} modifié avec succès`});
    });
});

module.exports = router;
