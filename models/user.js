const db = require('../config/database.js')
const bcrypt = require('bcrypt');

const User = {
    createTable: (callback) => {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                is_admin INTEGER DEFAULT 0
            )
        `;
        db.run(query, (err) => {
            callback(err);
        });
    },

    createUser: (user, callback) => {
        const query = 'INSERT INTO users (username, password, email, is_admin) VALUES (?, ?, ?, 0)';
        const params = [user.username, user.hash, user.email];
        db.run(query, params, function (err) {
            callback(err, { id: this.lastID, ...user });
        });
    },

    getAllUsers: (callback) => {
        db.all('SELECT * FROM users', [], (err, results) => {
            callback(err, results)
        })
    },

    findUserByUsername: (username, callback) => {
        const query = 'SELECT * FROM users WHERE username = ?';
        db.get(query, [username], (err, user) => {
            callback(err, user)
        });
    },


    findUserByEmail: (username, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.get(query, [username], (err, user) => {
            callback(err, user)
        });
    },

    authenticate: (username, password, callback) => {
        User.findUserByUsername(username, (err, user) => {
            if (user != undefined && bcrypt.compareSync(password, user.password)) {
                user.connected = true;
                return callback(err, user)
            }
            else{
                user = {connected: false};
                return callback(err, user)
            }
        });
    },

    deleteUser: (id, callback) => {
        db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
            callback(err, {id});
        });
    }
};

module.exports = User;
