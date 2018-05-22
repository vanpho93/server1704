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

module.exports = { commentRouter };
