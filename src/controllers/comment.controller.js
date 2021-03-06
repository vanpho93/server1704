const express = require('express');
const { CommentService } = require('../services/comment.service');
const { mustBeUser } = require('../middlewares/mustBeUser.middleware');

const commentRouter = express.Router();

commentRouter.use(mustBeUser);

commentRouter.post('/', (req, res) => {
    const { idStory, content } = req.body;
    CommentService.createComment(req.idUser, idStory, content)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

commentRouter.put('/:_id', (req, res) => {
    const { content } = req.body;
    CommentService.updateComment(req.idUser, req.params._id, content)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

commentRouter.delete('/:_id', (req, res) => {
    CommentService.removeComment(req.idUser, req.params._id)
    .then(comment => res.send({ success: true, comment }))
    .catch(res.onError);
});

module.exports = { commentRouter };
