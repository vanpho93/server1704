const { User } = require('../models/user.model');
const { Story } = require('../models/story.model');
const { ServerError } = require('../models/server-error.model');
const { verify } = require('../helpers/jwt');
const { checkObjectId } = require('../helpers/checkObjectIds');

class StoryService {
    static async getAllStories() {
        return Story.find({}).populate('author', 'name');
    }

    static async createStory(idUser, content) {
        if (!content) throw new ServerError('EMPTY_CONTENT', 400);
        const story = new Story({ author: idUser, content });
        await story.save();
        await User.findByIdAndUpdate(idUser, { $push: { stories: story._id } });
        return Story.populate(story, { path: 'author', select: 'name' });
    }

    static async updateStory(idUser, idStory, content) {
        checkObjectId(idStory);
        if (!content) throw new ServerError('EMPTY_CONTENT', 400);
        const story = await Story.findOneAndUpdate({ _id: idStory, author: idUser }, { content }, { new: true });
        if (!story) throw new ServerError('CANNOT_FIND_STORY', 404);
        return story;
    }

    static async removeStory(idUser, idStory) {
        checkObjectId(idStory);
        const story = await Story.findOneAndRemove({ _id: idStory, author: idUser });
        if (!story) throw new ServerError('CANNOT_FIND_STORY', 404);
        await User.findByIdAndUpdate(idUser, { $pull: { stories: idStory } })
        return story;
    }
}

module.exports = { StoryService };
