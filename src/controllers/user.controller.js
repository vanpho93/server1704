const express = require('express');
const { UserService } = require('../services/user.service');

const userRouter = express.Router();

userRouter.post('/signup', (req, res) => {
    const { email, password, name } = req.body;
    UserService.signUp(email, password, name)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

userRouter.post('/signin', (req, res) => {
    const { email, password } = req.body;
    UserService.signIn(email, password)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

userRouter.post('/check', (req, res) => {
    const { token } = req.headers;
    UserService.check(token)
    .then(user => res.send({ success: true, user }))
    .catch(res.onError);
});

module.exports = { userRouter };
