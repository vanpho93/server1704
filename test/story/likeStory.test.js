const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../src/app');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');

describe('POST /story/like/:idStory', () => {
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

    it('Can like a story', async () => {
        const response = await request(app)
        .post('/story/like/' + idStory)
        .set({ token: token2 });
        const { success, message, story } = response.body;
        equal(success, true);
        equal(message, undefined);
        equal(story.fans[0], idUser2);
        const storyDb = await Story.findById(idStory).populate('fans');
        equal(storyDb.fans[0].name, 'Ti Nguyen');
    });

    it('Cannot like a story with invalid id', async () => {
        const response = await request(app)
        .post('/story/like/123')
        .set({ token: token2 });
        const { success, message, story } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'INVALID_ID');
        equal(story, undefined);
        const storyDb = await Story.findById(idStory);
        equal(storyDb.fans.length, 0);
    });

    it('Cannot like a story with invalid token', async () => {
        const response = await request(app)
        .post('/story/like/' + idStory)
        .set({ token: 'a.b.c' });
        const { success, message, story } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(story, undefined);
        const storyDb = await Story.findById(idStory);
        equal(storyDb.fans.length, 0);
    });

    it('Cannot like a removed story', async () => {
        await StoryService.removeStory(idUser1, idStory);
        const response = await request(app)
        .post('/story/like/' + idStory)
        .set({ token: token2 });
        const { success, message, story } = response.body;
        equal(response.status, 404);
        equal(success, false);
        equal(message, 'CANNOT_FIND_STORY');
        equal(story, undefined);
        const storyDb = await Story.findById(idStory);
        equal(storyDb, null);
    });

    it('Cannot like a story twice', async () => {
        await StoryService.likeStory(idUser2, idStory);
        const response = await request(app)
        .post('/story/like/' + idStory)
        .set({ token: token2 });
        const { success, message, story } = response.body;
        equal(response.status, 404);
        equal(success, false);
        equal(message, 'CANNOT_FIND_STORY');
        equal(story, undefined);
        const storyDb = await Story.findById(idStory).populate('fans');
        equal(storyDb.fans[0]._id.toString(), idUser2);
    });
});
