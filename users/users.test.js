const db = require('../data/config');
const supertest = require('supertest');
const server = require('../api/server.js');

let fToken;
let frToken;

const fuckingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJmdW5kZXIiLCJpYXQiOjE2MDU4MTA3NzF9.lQRDKCuTixlmI5EqmxqxLJSY6CyBmiTQavVgzL3hkgI'

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

describe('usersRouter', () => {
    it('wont get users when you dont have token', async () => {
        const res = await supertest(server).get('/api/users');
        expect(res.status).toBe(401);
    })
    it('gives you users when you have a token', async () => {
        const res = await supertest(server)
        .post('/api/auth/register')
        .send({display_name: 'sam', password: 'sam', email: 'sam', role: 'funder'});

        const res2 = await supertest(server)
        .post('/api/auth/login')
        .send({email: 'sam', password: 'sam'});

        const token = res2.body.token;

        const res3 = await supertest(server)
        .get('/api/users')
        .set('Authorization', token)
        console.log(res3.status)
        expect(res3.status).toBe(200)
    })

    it('returns an error when you get a specific user with an invalid id, even with a token', async () => {
        const res = await supertest(server)
        .post('/api/auth/register')
        .send({display_name: 'sam', password: 'sam', email: 'sam', role: 'funder'});

        const res2 = await supertest(server)
        .post('/api/auth/login')
        .send({email: 'sam', password: 'sam'});

        const token = res2.body.token;

        const res3 = await supertest(server)
        .get('/api/users/10')
        .set('Authorization', token)
        console.log(res3.status)
        expect(res3.status).toBe(404);
    })

    it('gives you a specific user with a valid id', async () => {
        const res = await supertest(server)
        .post('/api/auth/register')
        .send({display_name: 'sam', password: 'sam', email: 'sam', role: 'funder'});

        const res2 = await supertest(server)
        .post('/api/auth/login')
        .send({email: 'sam', password: 'sam'});

        const token = res2.body.token;

        const res3 = await supertest(server)
        .get('/api/users/1')
        .set('Authorization', fuckingToken)
        expect(res3.status).toBe(200);
    })
})