const request = require('supertest');
const { equal } = require('assert');
const { app } = require('../../src/app');
const { User } = require('../../src/models/user.model');
const { FriendService } = require('../../src/services/friend.service');
const { UserService } = require('../../src/services/user.service');

describe('POST /friend/cancel/:idOther', () => {
    let token1, idUser1, token2, idUser2, token3, idUser3;

    beforeEach('Create user for test', async () => {
        const user1 = await UserService.signUp('teo@gmail.com', '123', 'Teo Nguyen');
        token1 = user1.token;
        idUser1 = user1._id;
        const user2 = await UserService.signUp('ti@gmail.com', '123', 'Ti Nguyen');
        token2 = user2.token;
        idUser2 = user2._id;
        const user3 = await UserService.signUp('tun@gmail.com', '123', 'Tun Nguyen');
        token3 = user3.token;
        idUser3 = user3._id;
        await FriendService.sendFriendRequest(idUser1.toString(), idUser2.toString());
        await FriendService.acceptFriendRequest(idUser2.toString(), idUser1.toString());
    });

    it('Can remove friend', async () => {
        const response = await request(app)
            .delete('/friend/' + idUser2)
            .set({ token: token1 });
        const { user, success } = response.body;
        equal(response.status, 200);
        equal(user.name, 'Ti Nguyen');
        equal(user._id, idUser2);
        const user1 = await User.findById(idUser1).populate('friends');
        const user2 = await User.findById(idUser2).populate('friends');
        equal(user1.friends.length, 0);
        equal(user2.friends.length, 0);
    });
});
