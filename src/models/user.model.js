const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }]
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
