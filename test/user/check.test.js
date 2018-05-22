const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { UserService } = require('../../src/services/user.service');

describe('POST /user/check', () => {
    let token;

    beforeEach('Sign up for test', async () => {
        const user = await UserService.signUp('teo1@gmail.com', '123', 'Teo Nguyen');
        token = user.token;
    });

    it('Can check token', async () => {
        const response = await request(app).
        post('/user/check', {})
        .set({ token });
        const { success, user } = response.body;
        const { name, password, email } = user;
        equal(name, 'Teo Nguyen');
        equal(email, 'teo1@gmail.com');
        equal(password, undefined);
    });

    it('Cannot check with invalid token', async () => {
        const response = await request(app).
        post('/user/check', {})
        .set({ token: 'abcd' });
        const { success, user, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'INVALID_TOKEN');
    });

    it('Cannot check without token', async () => {
        const response = await request(app).
        post('/user/check', {})
        equal(response.status, 400);
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'EMPTY_TOKEN');
    });

    it('Cannot check with removed user\'s token', async () => {
        await User.findOneAndRemove({});
        const response = await request(app).
        post('/user/check', {})
        .set({ token });
        const { success, user, message } = response.body;
        equal(response.status, 404);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'CANNOT_FIND_USER');
    });
});
