const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };
