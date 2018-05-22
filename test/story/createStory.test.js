const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');

describe('POST /story', () => {
    let token, idUser;
    beforeEach('Create user for test', async () => {
        const user = await UserService.signUp('teo@gmail.com', '123', 'Teo Nguyen');
        token = user.token;
        idUser = user._id;
    });

    it('Can create new story', async () => {
        const response = await request(app)
        .post('/story')
        .send({ content: 'ABCD' })
        .set({ token });
        const { success, message, story } = response.body;
        equal(success, true);
        equal(message, undefined);
        equal(story.content, 'ABCD');
        equal(story.author._id, idUser);
        equal(story.author.name, 'Teo Nguyen');
        const user = await User.findById(idUser).populate('stories');
        equal(user.stories[0].content, 'ABCD');
    });

    it('Cannot create story without content', async () => {
        const response = await request(app)
        .post('/story')
        .send({ content: '' })
        .set({ token });
        const { success, message, story } = response.body;
        equal(success, false);
        equal(message, 'EMPTY_CONTENT');
        equal(story, undefined);
        equal(response.status, 400);
    });

    it('Cannot create story without token', async () => {
        const response = await request(app)
        .post('/story')
        .send({ content: 'ABCD' })
        const { success, message, story } = response.body;
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(story, undefined);
        equal(response.status, 400);
    });

    it('Cannot create story with invalid token', async () => {
        const response = await request(app)
        .post('/story')
        .send({ content: 'ABCD' })
        .set({ token: 'a.b.c' })
        const { success, message, story } = response.body;
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(story, undefined);
        equal(response.status, 400);
    });
});
