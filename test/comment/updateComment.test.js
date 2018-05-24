const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../src/app');
const { Story } = require('../../src/models/story.model');
const { Comment } = require('../../src/models/comment.model');
const { UserService } = require('../../src/services/user.service');
const { StoryService } = require('../../src/services/story.service');
const { CommentService } = require('../../src/services/comment.service');

describe('PUT /comment/:id', () => {
    let token1, idUser1, token2, idUser2, idStory, idComment;

    beforeEach('Create user for test', async () => {
        const user1 = await UserService.signUp('teo@gmail.com', '123', 'Teo Nguyen');
        token1 = user1.token;
        idUser1 = user1._id;
        const user2 = await UserService.signUp('ti@gmail.com', '123', 'Ti Nguyen');
        token2 = user2.token;
        idUser2 = user2._id;
        const story = await StoryService.createStory(idUser1, 'ABCD');
        idStory = story._id;
        const comment = await CommentService.createComment(idUser2, idStory, 'XYZ');
        idComment = comment._id;
    });

    it('Can update comment', async () => {
        const response = await request(app)
        .put('/comment/' + idComment)
        .send({ content: 'RST' })
        .set({ token: token2 });
        const { success, message, comment } = response.body;
        equal(success, true);
        equal(message, undefined);
        equal(comment.content, 'RST');
        equal(comment.author, idUser2);
        const commentDb = await Comment.findById(idComment);
        equal(commentDb.content, 'RST');
    });

    it('Cannot update comment with empty content', async () => {
        const response = await request(app)
        .put('/comment/' + idComment)
        .send({ content: '' })
        .set({ token: token2 });
        const { success, message, comment } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'EMPTY_CONTENT');
        equal(comment, undefined);
        const commentDb = await Comment.findById(idComment);
        equal(commentDb.content, 'XYZ');
    });

    it('Cannot update comment with invalid id', async () => {
        const response = await request(app)
        .put('/comment/123')
        .send({ content: 'RSI' })
        .set({ token: token2 });
        const { success, message, comment } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'INVALID_ID');
        equal(comment, undefined);
        const commentDb = await Comment.findById(idComment);
        equal(commentDb.content, 'XYZ');
    });

    it('Cannot update comment with invalid token', async () => {
        const response = await request(app)
        .put('/comment/' + idComment)
        .send({ content: 'RSI' })
        .set({ token: 'a.b.c' });
        const { success, message, comment } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(comment, undefined);
        const commentDb = await Comment.findById(idComment);
        equal(commentDb.content, 'XYZ');
    });

    it('Cannot update comment without token', async () => {
        const response = await request(app)
        .put('/comment/' + idComment)
        .send({ content: 'RSI' })
        .set({ token: '' });
        const { success, message, comment } = response.body;
        equal(response.status, 400);
        equal(success, false);
        equal(message, 'INVALID_TOKEN');
        equal(comment, undefined);
        const commentDb = await Comment.findById(idComment);
        equal(commentDb.content, 'XYZ');
    });

    it('Cannot update comment with token1', async () => {
        const response = await request(app)
        .put('/comment/' + idComment)
        .send({ content: 'RSI' })
        .set({ token: token1 });
        const { success, message, comment } = response.body;
        equal(response.status, 404);
        equal(success, false);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(comment, undefined);
        const commentDb = await Comment.findById(idComment);
        equal(commentDb.content, 'XYZ');
    });

    it('Cannot update a removed comment', async () => {
        await CommentService.removeComment(idUser2, idComment);
        const response = await request(app)
        .put('/comment/' + idComment)
        .send({ content: 'RSI' })
        .set({ token: token1 });
        const { success, message, comment } = response.body;
        equal(response.status, 404);
        equal(success, false);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(comment, undefined);
        const commentDb = await Comment.findById(idComment);
        equal(commentDb, null);
    });

    it('Cannot update comment a removed story', async () => {
        await StoryService.removeStory(idUser1, idStory);
        const response = await request(app)
        .put('/comment/' + idComment)
        .send({ content: 'RSI' })
        .set({ token: token1 });
        const { success, message, comment } = response.body;
        equal(response.status, 404);
        equal(success, false);
        equal(message, 'CANNOT_FIND_COMMENT');
        equal(comment, undefined);
        const commentDb = await Comment.findById(idComment);
        equal(commentDb, null);
    });
});
