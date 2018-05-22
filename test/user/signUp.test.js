const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { UserService } = require('../../src/services/user.service');

describe('POST /user/signup', () => {
    it('Can sign up', async () => {
        const body = {
            email: 'teo1@gmail.com',
            password: '123',
            name: 'Teo Nguyen'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(body);
        const { success, user } = response.body;
        const { email, name, password, _id } = user;
        equal(response.status, 200);
        equal(success, true);
        equal(email, 'teo1@gmail.com');
        equal(name, 'Teo Nguyen');
        equal(password, undefined);
        const userInDb = await User.findById(_id);
        equal(userInDb.email, 'teo1@gmail.com');
        equal(userInDb.name, 'Teo Nguyen');
    });

    it('Cannot sign up without email', async () => {
        const body = {
            email: '',
            password: '123',
            name: 'Teo Nguyen'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(body);
        const { success, user, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'EMPTY_EMAIL');
        const userInDb = await User.findOne({});
        equal(userInDb, null);
    });

    it('Cannot sign up without name', async () => {
        const body = {
            email: 'teo1@gmail.com',
            password: '123',
        };
        const response = await request(app)
        .post('/user/signup')
        .send(body);
        const { success, user, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'EMPTY_NAME');
        const userInDb = await User.findOne({});
        equal(userInDb, null);
    });

    it('Cannot sign up without password', async () => {
        const body = {
            email: 'teo1@gmail.com',
            name: 'Teo Nguyen'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(body);
        const { success, user, message } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'EMPTY_PASSWORD');
        const userInDb = await User.findOne({});
        equal(userInDb, null);
    });

    it('Cannot sign up 2 account with 1 email', async () => {
        await UserService.signUp('teo1@gmail.com', '321', 'Teo');
        const body = {
            email: 'teo1@gmail.com',
            name: 'Teo Nguyen',
            password: '123'
        };
        const response = await request(app)
        .post('/user/signup')
        .send(body);
        const { success, user, message } = response.body;
        equal(response.status, 409);
        equal(success, false);
        equal(user, undefined);
        equal(message, 'EMAIL_EXISTED');
        const userInDb = await User.findOne({});
        equal(userInDb.email, 'teo1@gmail.com');
    });
});
