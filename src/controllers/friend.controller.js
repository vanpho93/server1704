const express = require('express');
const { FriendService } = require('../services/friend.service');
const { mustBeUser } = require('../middlewares/mustBeUser.middleware');

const friendRouter = express.Router();

friendRouter.use(mustBeUser);

friendRouter.get('/', (req, res) => {
    FriendService.getPeople(req.idUser)
    .then(people => res.send({ success: true, people }))
    .catch(res.onError);
});

friendRouter.post('/add/:idOther', (req, res) => {
    FriendService.sendFriendRequest(req.idUser, req.params.idOther)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

friendRouter.post('/cancel/:idOther', (req, res) => {
    FriendService.cancelFriendRequest(req.idUser, req.params.idOther)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

friendRouter.post('/accept/:idOther', (req, res) => {
    FriendService.acceptFriendRequest(req.idUser, req.params.idOther)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

friendRouter.post('/decline/:idOther', (req, res) => {
    FriendService.declineFriendRequest(req.idUser, req.params.idOther)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

friendRouter.delete('/:idOther', (req, res) => {
    FriendService.removeFriendRequest(req.idUser, req.params.idOther)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

module.exports = { friendRouter };
