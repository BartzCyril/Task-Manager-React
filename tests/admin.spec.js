const server = require('../server').createServer();
const request = require("supertest");
const { seedDatabase } = require('../config/seed-memory-database');

jest.mock('../middlewares/logged', () => jest.fn((req, res, next) => next()));
jest.mock('../middlewares/admin', () => jest.fn((req, res, next) => next()));
jest.mock('../middlewares/token', () => ({
    checkValidityOfTheToken: jest.fn((req, res, next) => next()),
}));

beforeAll(async () => {
    await seedDatabase();
});

describe("Tests fonctionnels pour admin", () => {
    test("Suppression d'un utilisateur", async () => {
        const response = await request(server).delete('/admin/3');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: 'Utilisateur #3 supprimé avec succès' });
    });
});