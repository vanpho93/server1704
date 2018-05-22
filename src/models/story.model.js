const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Story = mongoose.model('Story', storySchema);

module.exports = { Story };
