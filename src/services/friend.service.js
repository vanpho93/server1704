const { User } = require('../models/user.model');
const { ServerError } = require('../models/server-error.model');
const { checkObjectId } = require('../helpers/checkObjectIds');

class FriendService {
    static async getPeople() {}
    static async sendFriendRequest(idUser, idOther) {
        checkObjectId(idOther);
        if (idUser.trim() === idOther.trim()) {
            throw new ServerError('CANNOT_ADD_YOURSELF', 400);
        }
        const queryObject1 = {
            _id: idUser,
            friends: { $ne: idOther },
            inCommingRequests: { $ne: idOther },
            sentRequests: { $ne: idOther },
        };
        const user = await User.findOneAndUpdate(queryObject1, { $push: { sentRequests: idOther } });
        if (!user) throw new ServerError('CANNOT_FIND_USER', 404);
        const queryObject2 = {
            _id: idOther,
            friends: { $ne: idUser },
            inCommingRequests: { $ne: idUser },
            sentRequests: { $ne: idUser },
        };
        const options = { fields: { name: 1 } };
        const other = await User.findOneAndUpdate(queryObject2, { $push: { inCommingRequests: idUser } }, options);
        if (!other) throw new ServerError('CANNOT_FIND_USER', 404);
        return other;
    }
    static async cancelFriendRequest(idUser, idOther) {
        checkObjectId(idOther);
        const queryObject1 = {
            _id: idUser,
            friends: { $ne: idOther },
            inCommingRequests: { $ne: idOther },
            sentRequests: idOther
        };
        const user = await User.findOneAndUpdate(queryObject1, { $pull: { sentRequests: idOther } });
        if (!user) throw new ServerError('CANNOT_FIND_USER', 404);
        const queryObject2 = {
            _id: idOther,
            friends: { $ne: idUser },
            inCommingRequests: idUser,
            sentRequests: { $ne: idUser },
        };
        const options = { fields: { name: 1 } };
        const other = await User.findOneAndUpdate(queryObject2, { $pull: { inCommingRequests: idUser } }, options);
        if (!other) throw new ServerError('CANNOT_FIND_USER', 404);
        return other;
    }
    static async acceptFriendRequest() {}
    static async declineFriendRequest() {}
    static async removeFriendRequest() {}
}

module.exports = { FriendService };
