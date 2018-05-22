const express = require('express');
const { StoryService } = require('../services/story.service');
const { mustBeUser } = require('../middlewares/mustBeUser.middleware');

const storyRouter = express.Router();

storyRouter.get('/', (req, res) => {
    StoryService.getAllStories()
    .then(stories => res.send({ success: true, stories }))
    .catch(res.onError);
});

storyRouter.use(mustBeUser);

storyRouter.put('/:idStory', (req, res) => {
    const { params, body } = req;
    StoryService.updateStory(req.idUser, params.idStory, body.content)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

storyRouter.post('/', (req, res) => {
    StoryService.createStory(req.idUser, req.body.content)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

storyRouter.delete('/:idStory', (req, res) => {
    StoryService.removeStory(req.idUser, req.params.idStory)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

storyRouter.post('/like/:idStory', (req, res) => {
    StoryService.likeStory(req.idUser, req.params.idStory)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

storyRouter.post('/dislike/:idStory', (req, res) => {
    StoryService.dislikeStory(req.idUser, req.params.idStory)
    .then(story => res.send({ success: true, story }))
    .catch(res.onError);
});

module.exports = { storyRouter };
