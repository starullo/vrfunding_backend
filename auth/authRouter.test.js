const db = require('../data/config');
const supertest = require('supertest');
const server = require('../api/server.js');

let fToken;
let frToken;

beforeEach(async () => {
    await db('users').truncate();
})

afterAll(async () => {
    await db('users').truncate();
})

beforeEach(async () => {
    const test1 = await supertest(server)
    .post('/api/auth/register')
    .send({display_name: 'funder', password: 'funder', email: 'funder', role: 'funder'})

    const test2 = await supertest(server)
    .post('/api/auth/register')
    .send({display_name: 'fundraiser', password: 'fundraiser', email: 'fundraiser', role: 'fundraiser'})

    const login1 = await supertest(server)
    .post('/api/auth/login')
    .send({email: 'funder', password: 'funder'});
    fToken = login1.body.token

    const login2 = await supertest(server)
    .post('/api/auth/login')
    .send({email: 'fundraiser', password: 'fundraiser'})
    frToken = login2.body.token
})


describe('register', () => {
    it('allows people to register', async () => {
        const res = await supertest(server)
        .post('/api/auth/register')
        .send({"display_name": "wow", "password": "wow", "email": "wow@wow.com", "role": "funder"});
        expect(res.statusCode).toBe(201);
        
        const res2 = await supertest(server)
        .post('/api/auth/register')
        .send({display_name: 'hey', password: 'hey', email: 'hey@wow.com', role: 'fundraiser'});
        expect(res2.statusCode).toBe(201);
    })
})

describe('login', () => {
    it('allows people to login', async () => {
        const res = await supertest(server)
        .post('/api/auth/register')
        .send({"display_name": "wow", "password": "wow", "email": "wow@wow.com", "role": "funder"});
        expect(res.statusCode).toBe(201);

        const res2 = await supertest(server)
        .post('/api/auth/login')
        .send({email: "wow@wow.com", password: "wow"})
        expect(res.body.token).toBeTruthy;
        expect(res.body.role).toBe('funder')
    })
})


