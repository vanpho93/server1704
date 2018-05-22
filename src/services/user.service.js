const { User } = require('../models/user.model');
const { hash, compare } = require('bcrypt');
const { sign, verify } = require('../helpers/jwt');
const { ServerError } = require('../models/server-error.model');

class UserService {
    static async getUserObject(user) {
        const userInfo = user.toObject();
        const token = await sign({ _id: user._id });
        userInfo.token = token;
        delete userInfo.password;
        return userInfo;
    }

    static async signIn(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new ServerError('INVALID_USER_INFO', 404);
        const same = await compare(password, user.password);
        if (!same) throw new ServerError('INVALID_USER_INFO', 404);
        return UserService.getUserObject(user);
    }

    static async signUp(email, password, name) {
        if (!email) throw new ServerError('EMPTY_EMAIL', 400);
        if (!password) throw new ServerError('EMPTY_PASSWORD', 400);
        if (!name) throw new ServerError('EMPTY_NAME', 400);
        const encrypted = await hash(password, 8);
        try {
            const user = new User({ email, password: encrypted, name });
            await user.save();
            return UserService.getUserObject(user);
        } catch (error) {
            throw new ServerError('EMAIL_EXISTED', 409);
        }
    }

    static async check(token) {
        if (!token) throw new ServerError('EMPTY_TOKEN', 400);
        const { _id } = await verify(token).catch(() => {
            throw new ServerError('INVALID_TOKEN', 400);
        });
        const user = await User.findById(_id);
        if (!user) throw new ServerError('CANNOT_FIND_USER', 404);
        return UserService.getUserObject(user);
    }
}

module.exports = { UserService };
