const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../src/app');
const { Story } = require('../../src/models/story.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');

describe('POST /comment', () => {
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

    it('Can create new comment', async () => {
        const response = await request(app)
        .post('/comment')
        .send({ idStory, content: 'XYZ' })
        .set({ token: token2 });
        const { success, message, comment } = response.body;
        equal(success, true);
        equal(message, undefined);
        equal(comment.content, 'XYZ');
        equal(comment.author._id, idUser2);
        equal(comment.author.name, 'Ti Nguyen');
        const story = await Story.findById(idStory).populate('comments');
        equal(story.comments[0].content, 'XYZ');
    });

    it('Cannot create comment without content', async () => {
        const response = await request(app)
        .post('/comment')
        .send({ idStory, content: '' })
        .set({ token: token2 });
        const { success, message, comment } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'EMPTY_CONTENT');
        equal(comment, undefined);
        const story = await Story.findById(idStory).populate('comments');
        equal(story.comments.length, 0);
    });

    it('Cannot create comment without token', async () => {
        const response = await request(app)
        .post('/comment')
        .send({ idStory, content: 'XYZ' })
        .set({ token: '' });
        const { success, message, comment } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(comment, undefined);
        const story = await Story.findById(idStory).populate('comments');
        equal(story.comments.length, 0);
    });

    it('Cannot create comment invalid token', async () => {
        const response = await request(app)
        .post('/comment')
        .send({ idStory, content: 'XYZ' })
        .set({ token: 'a.b.c' });
        const { success, message, comment } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(comment, undefined);
        const story = await Story.findById(idStory).populate('comments');
        equal(story.comments.length, 0);
    });

    it('Cannot create comment for removed story', async () => {
        await StoryService.removeStory(idUser1, idStory);
        const response = await request(app)
        .post('/comment')
        .send({ idStory, content: 'XYZ' })
        .set({ token: token2 });
        const { success, message, comment } = response.body;
        equal(response.status, 404);
        equal(success, false);
        equal(message, 'CANNOT_FIND_STORY');
        equal(comment, undefined);
        const commentDb = await Story.findOne({}).populate('comments');
        equal(commentDb, null);
        const story = await Story.findById(idStory).populate('comments');
        equal(story, null);
    });
});
