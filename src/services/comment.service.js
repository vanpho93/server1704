const { User } = require('../models/user.model');
const { Story } = require('../models/story.model');
const { Comment } = require('../models/comment.model');
const { ServerError } = require('../models/server-error.model');
const { verify } = require('../helpers/jwt');
const { checkObjectId } = require('../helpers/checkObjectIds');

class CommentService {
    static async createComment(idUser, idStory, content) {
        checkObjectId(idStory);
        if (!content) throw new ServerError('EMPTY_CONTENT', 400);
        const comment = new Comment({ author: idUser, story: idStory, content });
        await comment.save();
        const story = await Story.findByIdAndUpdate(idStory, { $push: { comments: comment._id } });
        if (!story) {
            await Comment.findByIdAndRemove(comment._id);
            throw new ServerError('CANNOT_FIND_STORY', 404);
        }
        return Comment.populate(comment, { path: 'author', select: 'name' });
    }

    static async updateComment(idUser, idComment, content) {
        checkObjectId(idComment);
        if (!content) throw new ServerError('EMPTY_CONTENT', 400);
        const comment = await Comment.findOneAndUpdate({ _id: idComment, author: idUser }, { content }, { new: true });
        if (!comment) throw new ServerError('CANNOT_FIND_COMMENT', 404);
        return comment;
    }
}

module.exports = { CommentService };
