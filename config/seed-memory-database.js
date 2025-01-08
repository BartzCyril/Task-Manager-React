const db = require('./database.js');

function seedDatabase() {
    return new Promise((resolve, reject) => {
        try {
            db.serialize(() => {
                // Suppression des tables existantes pour assurer une base propre
                db.run('DROP TABLE IF EXISTS tasks');
                db.run('DROP TABLE IF EXISTS users');

                // Création de la table users
                db.run(`
                    CREATE TABLE users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL,
                        password TEXT NOT NULL,
                        email TEXT NOT NULL UNIQUE,
                        is_admin BOOLEAN NOT NULL
                    )
                `);

                // Insertion des utilisateurs
                const users = [
                    { username: "admin", password: "$2b$10$DA7ohjIhQtxpuo1wlN5KvetPXArmr/VvwvpIqaKZdhoS.zhTMPkre", email: "admin@example.com", is_admin: 1 },
                    { username: "user1", password: "$2b$10$hzw1pCfJL2hjakDvbQiDF.yzFvChm0R.XKGm5T/0BW7v5.yk3Lndi", email: "user1@example.com", is_admin: 0 },
                    { username: "user2", password: "$2b$10$XLfS/bMt0IckfRg14csICek7LPHGrJov/Yde/f5Y7eTMlvfikIWhu", email: "user2@example.com", is_admin: 0 }
                ];

                users.forEach((user) => {
                    db.run(
                        `INSERT INTO users (username, password, email, is_admin)
                        VALUES (?, ?, ?, ?)`,
                        [user.username, user.password, user.email, user.is_admin]
                    );
                });

                // Création de la table tasks
                db.run(`
                    CREATE TABLE tasks (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        description TEXT,
                        completed BOOLEAN DEFAULT 0,
                        user_id INTEGER NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                `);

                // Insertion des tâches
                const tasks = [
                    { title: "Task 1", description: "Description of task 1", completed: 0, user_id: 2 },
                    { title: "Task 2", description: "Description of task 2", completed: 0, user_id: 2 },
                    { title: "Task 3", description: "Description of task 3", completed: 0, user_id: 3 }
                ];

                tasks.forEach((task) => {
                    db.run(
                        `INSERT INTO tasks (title, description, completed, user_id)
                        VALUES (?, ?, ?, ?)`,
                        [task.title, task.description, task.completed, task.user_id]
                    );
                });

                // Activer les clés étrangères
                db.run('PRAGMA foreign_keys = ON', (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = { seedDatabase };
