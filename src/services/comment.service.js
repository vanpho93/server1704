const { User } = require('../models/user.model');
const { Story } = require('../models/story.model');
const { Comment } = require('../models/comment.model');
const { ServerError } = require('../models/server-error.model');
const { verify } = require('../helpers/jwt');
const { checkObjectId } = require('../helpers/checkObjectIds');

class CommentService {
    static async createComment(idUser, idStory, content) {}
}

module.exports = { CommentService };
