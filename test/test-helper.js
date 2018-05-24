process.env.NODE_ENV = 'test';
const { User } = require('../src/models/user.model');
const { Story } = require('../src/models/story.model');
const { Comment } = require('../src/models/comment.model');

require('../src/helpers/connectDatabase');

beforeEach('Remove all data for testing', async () => {
    await User.remove({});
    await Story.remove({});
    await Comment.remove({});
});
