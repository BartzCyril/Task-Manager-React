/* Tests unitaires */
const User = require('../models/user')

describe("Tests unitaires pour register", () => {
    test('Récupère tous les utilisateurs', done => {
        function callback(err, data) {
            if(err) {
                done(err);
                return;
            }
            try {
                expect(data.length).toBe(3);
                done();
            } catch (err) {
                done(err);
            }
        }
    
        User.getAllUsers(callback)
    });
    
    test('Récupère un utilisateur en fonction de son username', done => {
        function callback(err, data) {
            if(err) {
                done(err);
                return;
            }
            try {
                expect(data.id).toBe(2);
                expect(data.username).toBe("user1")
                expect(data.email).toBe("user1@example.com")
                done();
            } catch (err) {
                done(err);
            }
        }
    
        User.findUserByUsername("user1", callback)
    });
    
    
    test('Récupère un utilisateur en fonction de son username qui n\'existe pas', done => {
        function callback(err, data) {
            if(err) {
                done(err);
                return;
            }
            try {
                expect(data).toBe(undefined)
                done();
            } catch (err) {
                done(err);
            }
        }
    
    
        User.findUserByUsername("user4", callback)
    });
    
    test('Récupère un utilisateur en fonction de son adresse mail', done => {
        function callback(err, data) {
            if(err) {
                done(err);
                return;
            }
            try {
                expect(data.id).toBe(3);
                expect(data.username).toBe("user2");
                expect(data.email).toBe("user2@example.com");
                done();
            } catch (err) {
                done(err);
            }
        }
    
        User.findUserByEmail("user2@example.com", callback)
    });
    
    test('Récupère un utilisateur en fonction de son adresse mail qui n\'existe pas', done => {
        function callback(err, data) {
            if(err) {
                done(err);
                return;
            }
            try {
                expect(data).toBe(undefined)
                done();
            } catch (err) {
                done(err);
            }
        }
    
    
        User.findUserByUsername("user4", callback)
    });
});

/* Tests fonctionnels */
const server = require('../server').createServer();
const request = require("supertest");
const { seedDatabase } = require('../config/seed-memory-database');

beforeAll(async () => {
    await seedDatabase();
})

describe('POST /auth/register', () => {
    it('should return 400 if username is undefined', async () => {
        const body = {
            username: undefined,
            password: "Le#PetitChat1",
            confirmPassword: "Le#PetitChat1",
            email: "unittest1@test.com"
        }
        const res = await request(server)
                    .post('/auth/register')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
        
        expect(res.status).toBe(400);
        expect(JSON.parse(res.text).message).toBe("Le champ 'username' est obligatoire");
    });

    it('should return 400 if password is undefined', async () => {
        const body = {
            username: "unittest1",
            password: undefined,
            confirmPassword: "Le#PetitChat1",
            email: "unittest1@test.com"
        }
        const res = await request(server)
                    .post('/auth/register')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
        
        expect(res.status).toBe(400);
        expect(JSON.parse(res.text).message).toBe("Le champ 'password' est obligatoire");
    });

    it('should return 400 if email is undefined', async () => {
        const body = {
            username: "unittest1",
            password: "Le#PetitChat1",
            confirmPassword: "Le#PetitChat1",
            email: undefined
        }
        const res = await request(server)
                    .post('/auth/register')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
        
        expect(res.status).toBe(400);
        expect(JSON.parse(res.text).message).toBe("Le champ 'email' est obligatoire");
    });

    it('should return 400 if email is not a email format', async () => {
        const body = {
            username: "unittest1",
            password: "Le#PetitChat1",
            confirmPassword: "Le#PetitChat1",
            email: "unitest1"
        }
        const res = await request(server)
                    .post('/auth/register')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
        
        expect(res.status).toBe(400);
        expect(JSON.parse(res.text).message).toBe("Veuillez saisir une adresse mail dans le champ 'email'");
    });

    it('should return 400 if password doesn\'t respect criteria', async () => {
        const body = {
            username: "unittest1",
            password: "LePetitChat1",
            confirmPassword: "LePetitChat1",
            email: "unitest1@test.com"
        }
        const res = await request(server)
                    .post('/auth/register')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
        
        expect(res.status).toBe(400);
        expect(JSON.parse(res.text).message).toBe("Le mot de passe que vous avez saisir ne correspond pas au critière. Votre mot de passe doit contenir au moins 8 caractères, une lettre en minuscule et majucule, un nombre et un caractère spécial");
    });

    it('should return 400 if username is already taken', async () => {
        const body = {
            username: "user1",
            password: "Le#PetitChat1",
            confirmPassword: "Le#PetitChat1",
            email: "unitest1@test.com"
        }
        const res = await request(server)
                    .post('/auth/register')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
        
        expect(res.status).toBe(400);
        expect(JSON.parse(res.text).message).toBe("L'utilisateur user1 existe déjà");
    });

    it('should return 400 if email address is already taken', async () => {
        const body = {
            username: "unittest1",
            password: "Le#PetitChat1",
            confirmPassword: "Le#PetitChat1",
            email: "user1@example.com"
        }
        const res = await request(server)
                    .post('/auth/register')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
        
        expect(res.status).toBe(400);
        expect(JSON.parse(res.text).message).toBe("L'adresse mail user1@example.com existe déjà");
    });

    it('should return 400 if password and confirmPassword are different', async () => {
        const body = {
            username: "unittest1",
            password: "Le#PetitChat1",
            confirmPassword: "Le#PetitChat2",
            email: "unittest1@example.com"
        }
        const res = await request(server)
                    .post('/auth/register')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')

        expect(res.status).toBe(400);
    });

    it('should return 200 if everythink is ok', async () => {
        const body = {
            username: "unittest1",
            password: "Le#PetitChat1",
            confirmPassword: "Le#PetitChat1",
            email: "unittest1@example.com"
        }
        const res = await request(server)
                    .post('/auth/register')
                    .send(body)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
        
        expect(res.status).toBe(200);
    });
})