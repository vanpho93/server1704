const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');

describe('DELET /story/:idStory', () => {
    let token1, idUser1, token2, idUser2, idStory;

    beforeEach('Create user for test', async () => {
        const user1 = await UserService.signUp('teo@gmail.com', '123', 'Teo Nguyen');
        token1 = user1.token;
        idUser1 = user1._id;
        const user2 = await UserService.signUp('ti@gmail.com', '123', 'Ti Nguyen');
        token2 = user2.token;
        idUser2 = user2._id;
        const story = await StoryService.createStory(idUser1, 'ABCD');
        idStory = story._id;
    });

    it('Can remove story', async () => {
        const response = await request(app)
        .delete('/story/' + idStory)
        .set({ token: token1 });
        const { success, message, story } = response.body;
        equal(success, true);
        equal(message, undefined);
        equal(story.content, 'ABCD');
        const count = await Story.count({});
        equal(count, 0);
        const user = await User.findById(idUser1);
        equal(user.stories.length, 0);
    });

    it('Cannot remove story with invalid id', async () => {
        const response = await request(app)
        .delete('/story/123')
        .set({ token: token1 });
        const { success, message, story } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'INVALID_ID');
        equal(story, undefined);
        const count = await Story.count({});
        equal(count, 1);
    });

    it('Cannot remove story with invalid token', async () => {
        const response = await request(app)
        .delete('/story/' + idStory)
        .set({ token: 'a.b.c' });
        const { success, message, story } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(story, undefined);
        const count = await Story.count({});
        equal(count, 1);
    });

    it('Cannot remove story with token 2', async () => {
        const response = await request(app)
        .delete('/story/' + idStory)
        .set({ token: token2 });
        const { success, message, story } = response.body;
        equal(response.status, 404);
        equal(success, false);
        equal(message, 'CANNOT_FIND_STORY');
        equal(story, undefined);
        const count = await Story.count({});
        equal(count, 1);
    });

    it('Cannot remove story twice', async () => {
        await StoryService.removeStory(idUser1, idStory);
        const response = await request(app)
        .delete('/story/' + idStory)
        .set({ token: token1 });
        const { success, message, story } = response.body;
        equal(response.status, 404);
        equal(success, false);
        equal(message, 'CANNOT_FIND_STORY');
        equal(story, undefined);
        const count = await Story.count({});
        equal(count, 0);
    })
});
