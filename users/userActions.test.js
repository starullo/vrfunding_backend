const db = require('../data/config');
const User = require('./usersActions');


beforeEach(async () => {
    await db('users').truncate()
})

afterAll(async () => {
    await db('users').truncate()
})


describe('users model', () => {
    describe('get users', () => {
        it('gets an empty array', async () => {
            const users = await User.getUsers();
            expect(users.length).toEqual(0)
        })
        it('gets all users', async () => {
            const user1 = await db('users').insert({display_name: 'wow', email: 'wow', password: 'wow', role: 'fundraiser'});

            const user2 = await db('users').insert({display_name: 'hey', email: 'hey', password: 'hey', role: 'funder'})

            const users = await User.getUsers();
            expect(users.length).toBe(2)
        })
    })
    describe('get user by id', () => {
        it('gets a user with a specific id', async () => {
            const user1 = await db('users').insert({display_name: 'wow', email: 'wow', password: 'wow', role: 'fundraiser'});

            const user2 = await db('users').insert({display_name: 'hey', email: 'hey', password: 'hey', role: 'funder'})

            const user = await User.getUserById(2);
            expect(user.id).toEqual(2)
            expect(user.id).not.toEqual(1)
        })
    })
    describe('get user by display name', () => {
        it('gets the user with the specified display name', async () => {
            const user1 = await db('users').insert({display_name: 'wow', email: 'wow', password: 'wow', role: 'fundraiser'});

            const user2 = await db('users').insert({display_name: 'hey', email: 'hey', password: 'hey', role: 'funder'})

            const user = await User.getUserByDisplayName('wow');
            expect(user.display_name).toBe('wow')
            expect(user.display_name).not.toBe('hey')
        })
    })
    describe('get user by email', () => {
        it('gets the user with the specified email', async () => {
            const user1 = await db('users').insert({display_name: 'wow', email: 'wow', password: 'wow', role: 'fundraiser'});

            const user2 = await db('users').insert({display_name: 'hey', email: 'hey', password: 'hey', role: 'funder'})

            const user = await User.getUserByEmail('wow');
            expect(user.email).toEqual('wow');
            expect(user.email).not.toEqual('hey')
        })
    })
    describe('add user', () => {
        it('adds a user to the database', async () => {
            let users = await db('users');
            expect(users.length).toEqual(0)

            const newUser = await User.addUser({display_name: 'wow', email: 'wow', password: 'wow', role: 'funder'});

            users = await db('users');
            expect(users.length).toEqual(1)
        })
    })

    describe('update user', () => {
        it('updates a user in the database', async () => {
            await db('users').insert({display_name: 'wow', email: 'wow', password: 'wow', role: 'funder'});
            let newUser = await db('users').where({id: 1}).first();
            expect(newUser.display_name).toEqual('wow')

            newUser = await User.updateUser(1, {display_name: 'hey', email: 'wow', password: 'wow', role: 'funder'});
            expect(newUser.display_name).toEqual('hey')
        })
    })
})