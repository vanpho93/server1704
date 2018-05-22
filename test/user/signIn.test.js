const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');

describe('POST /user/signin', () => {
    beforeEach('Sign up for test', async () => {
        const body = {
            email: 'teo1@gmail.com',
            password: '123',
            name: 'Teo Nguyen'
        };
        await request(app).post('/user/signup').send(body);
    });

    it('Can sign in', async () => {
        const body = {
            email: 'teo1@gmail.com',
            password: '123'
        };
        const response = await request(app).post('/user/signin').send(body);
        const { success, user } = response.body;
        equal(success, true);
        equal(user.name, 'Teo Nguyen');
        equal(user.password, undefined);
    });

    it('Cannot sign in with invalid password', async () => {
        const body = {
            email: 'teo1@gmail.com',
            password: '1234'
        };
        const response = await request(app).post('/user/signin').send(body);
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'INVALID_USER_INFO');
    });

    it('Cannot sign in with invalid email', async () => {
        const body = {
            email: 'teo2@gmail.com',
            password: '1234'
        };
        const response = await request(app).post('/user/signin').send(body);
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'INVALID_USER_INFO');
    });

    it('Cannot sign in without email', async () => {
        const body = {
            password: '1234'
        };
        const response = await request(app).post('/user/signin').send(body);
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'INVALID_USER_INFO');
    });

    it('Cannot sign in with removed user', async () => {
        await User.remove({});
        const body = {
            email: 'teo1@gmail.com',
            password: '123'
        };
        const response = await request(app).post('/user/signin').send(body);
        const { success, user, message } = response.body;
        equal(success, false);
        equal(user, undefined);
        equal(message, 'INVALID_USER_INFO');
    });
});
