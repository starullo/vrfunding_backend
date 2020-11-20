const db = require('../data/config');
const supertest = require('supertest');
const server = require('../api/server.js');
const Event = require('./eventsActions');

let fToken;
let frToken;
const fuckingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJmdW5kZXIiLCJpYXQiOjE2MDU4MTA3NzF9.lQRDKCuTixlmI5EqmxqxLJSY6CyBmiTQavVgzL3hkgI'

beforeEach(async () => {
    await db('projects').truncate();
    await db('donations').truncate();
})

afterAll(async () => {
    await db('projects').truncate();
    await db('donations').truncate();
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

describe('projects', () => {
    it('wont give you projects without a token', async () => {
        const res = await supertest(server)
        .get('/api/projects')
        expect(res.status).toBe(401)
    })
    it('gets projects with a token', async () => {

        const res = await supertest(server)
        .get('/api/projects')
        .set('Authorization', fuckingToken)
        expect(res.status).toBe(200)
    })
    it('gets a specific project with an id of that project', async () => {
        await db('projects').insert({project_name: 'wow', project_description: 'wow', funding_goal: 4000, creator_id: 1});
        const res = await supertest(server)
        .get('/api/projects/1')
        .set('Authorization', fuckingToken)
        const projects = await db('projects')
        expect(res.status).toBe(200);
        console.log(projects)
        expect(projects.length).toBe(1)
    })
    it('wont let you add projects without a fucking token', async () => {
        const res = await supertest(server)
        .post('/api/projects')
        .send({project_name: 'wow', project_description: 'wow', funding_goal: 1000, creator_id: 1})
        expect(res.status).toBe(401)
    })
    it('lets you add projects with a fucking token', async () => {
        const res = await supertest(server)
        .post('/api/projects')
        .send({project_name: 'wow', project_description: 'wow', funding_goal: 2000000, creator_id: 1})
        .set('Authorization', fuckingToken)
        expect(res.status).toBe(201)
    })
    it('lets you update projects', async () => {
        const post = await supertest(server)
        .post('/api/projects')
        .send({project_name: 'hey', project_description: 'hey', funding_goal: 234, creator_id: 1})
        .set('Authorization', fuckingToken)

        const put = await supertest(server)
        .put('/api/projects/1')
        .send({project_name: 'wow', project_description: 'wow', funding_goal: 234, creator_id: 1})
        .set('Authorization', fuckingToken);

        const [project] = await Event.getEventById(1);
        expect(project.project_description).toBe('wow')
    })
    it('lets you delete projects', async () => {
        const post = await supertest(server)
        .post('/api/projects')
        .send({project_name: 'wow', project_description: 'wow', funding_goal: 3434, creator_id: 1})
        .set('Authorization', fuckingToken)
        let projects = await Event.getAllEvents()
        expect(projects.length).toBe(1);

        await db('projects').where({id: 1}).delete();
        projects = await Event.getAllEvents;
        expect(projects.length).toBe(0)
    })
    it('lets you get funds for a specific project', async () => {
        const funds = await supertest(server)
        .get('/api/projects/1/funds')
        .set('Authorization', fuckingToken)
        expect(funds.status).toBe(200)
    })
    it('lets you add funds for a specific project', async () => {
        const res = await supertest(server)
        .post('/api/projects/1/funds')
        .send({amount: 500})
        .set('Authorization', fuckingToken)
        expect(res.status).toBe(201)
        const f = await supertest(server)
        .get('/api/funds')
        .set('Authorization', fuckingToken)
        expect(f.status).toBe(200)
        const funds = await db('donations')
        expect(funds.length).toBe(1)
    })
    it('lets you update a specific fund', async () => {
        const res = await supertest(server)
        .post('/api/projects/1/funds')
        .send({amount: 300})
        .set('Authorization', fuckingToken)
        expect(res.status).toBe(201)
        expect(res.body.amount).toBe(300)

        const res2 = await supertest(server)
        .put('/api/funds/1')
        .send({amount: 200})
        .set('Authorization', fuckingToken)
        
        const res3 = await supertest(server)
        .get('/api/funds/1')
        .set('Authorization', fuckingToken)
        expect(res3.body[0].amount).toBe(200)
    })
    it('lets you delete a specific fund', async () => {
        const res = await supertest(server)
        .post('/api/projects/1/funds')
        .send({amount: 300})
        .set('Authorization', fuckingToken)
        expect(res.status).toBe(201)
        const funds = await db('donations');
        expect(funds.length).toBe(1)

        const res2 = await supertest(server)
        .delete('/api/funds/1')
        .set('Authorization', fuckingToken)
        expect(res2.status).toBe(200)

        const funds2 = await db('donations');
        expect(funds2.length).toBe(0)

        const wow = await db('projects');
    })
})