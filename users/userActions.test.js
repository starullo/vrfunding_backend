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
        it ('gets an empty array', async () => {
            const users = await User.getUsers();
            expect(users.length).toEqual(0)
        })
    })
})