/* Tests unitaires */
const Task = require('../models/task')

describe("Tests unitaires pour task", () => {
    test('Récupère toutes les tâches pour un user', done => {
        function callback(err, data) {
            if(err) {
                done(err);
                return;
            }
            try {
                expect(data.length).toBe(2);
                done();
            } catch (err) {
                done(err);
            }
        }

        Task.getAllTaskByUserId(2, callback)
    });

    test('Créer une tâche', done => {
        function callback(err, data) {
            if(err) {
                done(err);
                return;
            }
            try {
                expect(data.id).toBe(4);
                done();
            } catch (err) {
                done(err);
            }
        }

        Task.createTask({ title: "Task 3", description: "Description of task 3", completed: 0, user_id: 2 }, callback)
    })

    test('Créer plusieurs tâches', done => {
        function callback(err, data) {
            if(err) {
                done(err);
                return;
            }
            try {
                expect(data).toBe(2);
                done();
            } catch (err) {
                done(err);
            }
        }

        Task.massCreateTask([
            { title: "Task 4", description: "Description of task 4", completed: 0, user_id: 2 },
            { title: "Task 5", description: "Description of task 5", completed: 0, user_id: 2 }
        ], callback);
    })

    test('Récupère une tâche par son id', done => {
        function callback(err, data) {
            if(err) {
                done(err);
                return;
            }
            try {
                expect(data.title).toBe("Task 1");
                done();
            } catch (err) {
                done(err);
            }
        }

        Task.getTaskById(1, callback)
    });

    test('Mettre à jour une tâche', done => {
        function callback(err, data) {
            if(err) {
                done(err);
                return;
            }
            try {
                expect(data.id).toBe(1);
                done();
            } catch (err) {
                done(err);
            }
        }

        Task.updateTask({ id: 1, title: "Task 1", description: "Description of task 1", completed: 1 }, callback)
    });

    test('Supprimer une tâche', done => {
        function callback(err, data) {
            if(err) {
                done(err);
                return;
            }
            try {
                expect(data.id).toBe(2);
                done();
            } catch (err) {
                done(err);
            }
        }

        Task.deleteTask(2, callback)
    });
});

/* Tests fonctionnels */
const server = require('../server').createServer();
const request = require("supertest");
const { seedDatabase } = require('../config/seed-memory-database');

beforeAll(async () => {
    await seedDatabase();
})

jest.mock('../middlewares/logged', () => jest.fn((req, res, next) => next()));
jest.mock('../middlewares/token', () => ({
    checkValidityOfTheToken: jest.fn((req, res, next) => next()),
}));

describe("Tests fonctionnels pour task", () => {
    test('Supprimer une tâche qui existe', done => {
        request(server)
            .delete('/1')
            .expect(204)
            .end(done);
    });

    test('Supprimer une tâche qui n\'existe pas', done => {
        request(server)
            .delete('/10')
            .expect(404)
            .end(done);
    });

    test('Modifier une tâche', done => {
        request(server)
            .put('/')
            .send({ id: 3, title: "Task 1", description: "Description of task 1", completed: 1 })
            .expect(204)
            .end(done);
    });

    test('Modifier une tâche qui n\'existe pas', done => {
        request(server)
            .put('/')
            .send({ id: 10, title: "Task 10", description: "Description of task 10", completed: 1 })
            .expect(404)
            .end(done);
    })
});