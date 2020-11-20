const db = require('../data/config');
const Event = require('./eventsActions');


beforeEach(async () => {
    await db('projects').truncate()
    await db('donations').truncate();
})

afterAll(async () => {
    await db('projects').truncate()
    await db('donations').truncate();
})

describe('eventsModel', () => {
    describe('getAllEvents', () => {
        it('gets all the events', async () => {
            await db('projects').insert({project_name: 'wow', project_description: 'wow', funding_goal: 1234, creator_id: 1});
            let events = await Event.getAllEvents();
            expect(events.length).toBe(1);
            
            await db('projects').insert({project_name: 'hey', project_description: 'hey', funding_goal: 232, creator_id: 1})
            events = await Event.getAllEvents();
            expect(events.length).toBe(2);
        })
    })
    describe('getEventById', () => {
        it('gets an event with the given id', async () => {
            await db('projects').insert({project_name: 'wow', project_description: 'wow', funding_goal: 1234, creator_id: 1});
            await db('projects').insert({project_name: 'hey', project_description: 'hey', funding_goal: 232, creator_id: 1});
            let [event] = await Event.getEventById(1);
            expect(event.project_name).toEqual('wow');

            [event] = await Event.getEventById(2);
            expect(event.project_name).toEqual('hey');
        })
    })
    describe('getEventByCreatorId', ()=>{
        it('gets an event/events with the given creator id', async () => {
            await db('projects').insert({project_name: 'wow', project_description: 'wow', funding_goal: 1234, creator_id: 1});
            await db('projects').insert({project_name: 'hey', project_description: 'hey', funding_goal: 232, creator_id: 1});      await db('projects').insert({project_name: 'okay', project_description: 'okay', funding_goal: 1234, creator_id: 1});
            await db('projects').insert({project_name: 'no', project_description: 'no', funding_goal: 232, creator_id: 1});       
            await db('projects').insert({project_name: 'woah', project_description: 'woah', funding_goal: 1234, creator_id: 2});
            await db('projects').insert({project_name: 'gosh', project_description: 'gosh', funding_goal: 232, creator_id: 2});

            let events = await Event.getEventByCreator(1);
            expect(events.length).toEqual(4);

            events = await Event.getEventByCreator(2);
            expect(events.length).toEqual(2);

            events = await Event.getEventByCreator(3);
            expect(events.length).toEqual(0);
        })
    })
    describe('addEvent', () => {
        it('adds an event', async () => {
            let events = await db('projects')
            expect(events.length).toEqual(0);

            let addedEvent = await Event.addEvent({project_name: 'gosh', project_description: 'gosh', funding_goal: 232, creator_id: 2});
            events = await db('projects');
            expect(events.length).toEqual(1);

            addedEvent = await Event.addEvent({project_name: 'woah', project_description: 'woah', funding_goal: 1234, creator_id: 2});
            events = await db('projects');
            expect(events.length).toEqual(2)
        })
    })
    describe('updateEvent', () => {
        it('updates an event', async () => {
            await db('projects').insert({project_name: 'gosh', project_description: 'gosh', funding_goal: 232, creator_id: 2});
            let [event] = await db('projects').where({id: 1});
            expect(event.funding_goal).toEqual(232);
            event = await Event.updateEvent(1, {project_name: 'gosh', project_description: 'wow', funding_goal: 5555, creator_id: 2});
            expect(event.funding_goal).toEqual(5555);
        })
    })
    describe('deleteEvent', () => {
        it('deletes an event', async () => {
            await db('projects').insert({project_name: 'gosh', project_description: 'gosh', funding_goal: 232, creator_id: 2});
            await db('projects').insert({project_name: 'woah', project_description: 'woah', funding_goal: 1234, creator_id: 2});
            let projects = await db('projects');
            expect(projects.length).toEqual(2);

            await Event.deleteEvent(1);
            projects = await db('projects');
            expect(projects.length).toEqual(1);
        })
    })
    describe('addFunds', () => {
        it('adds funds to a project with a given id', async () => {
            await db('projects').insert({project_name: 'gosh', project_description: 'gosh', funding_goal: 232, creator_id: 2});
            await Event.addFunds({amount: 400, donor_id: 1, project_id: 1});
            let funds = await db('donations');
            console.log(funds)
            expect(funds.length).toEqual(1)
        })
    })
    describe('getFundById', () => {
        it('gets the fund with the given id', async () => {
            await db('projects').insert({project_name: 'gosh', project_description: 'gosh', funding_goal: 232, creator_id: 2});
            await db('donations').insert({amount: 400, donor_id: 1, project_id: 1})
            let fund = await Event.getFundById(1);
            expect(fund.amount).toEqual(400)
        })
    })
    describe('updateFund', () => {
        it('updates the fund with the given id', async () => {
            await db('projects').insert({project_name: 'gosh', project_description: 'gosh', funding_goal: 232, creator_id: 2});
            await db('donations').insert({amount: 400, donor_id: 1, project_id: 1});
            let [fund] = await db('donations').where({id: 1});
            expect(fund.amount).toEqual(400)
            await Event.updateFund(1, {amount: 500, donor_id: 1, project_id: 1})
            let [fund2] = await db('donations').where({id: 1});
            expect(fund2.amount).toEqual(500);
        })
    })
    describe('deleteFund', () => {
        it('deletes the fund with the given id', async () => {
            await db('projects').insert({project_name: 'gosh', project_description: 'gosh', funding_goal: 232, creator_id: 2});
            await db('donations').insert({amount: 400, donor_id: 1, project_id: 1});
            let funds = await db('donations');
            expect(funds.length).toEqual(1);
            let x = await Event.deleteFund(1);
            funds = await db('donations');
            expect(funds.length).toEqual(0)
        })
    })
})