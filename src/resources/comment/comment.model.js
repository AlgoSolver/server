const mongoose = require('mongoose');

const objectId = mongoose.Schema.Types.ObjectId;

const Commentschmea = new mongoose.Schema({
    user: {
        type: objectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    upvoteCounter: {
        type: Number,
        default: 0
    },
    upvoters: [{
        type: objectId,
        ref: 'User'
    }],
    downvoteCounter: {
        type: Number,
        default: 0
    },
    downvoters: [{
        type: objectId,
        ref: 'User'
    }],
    parentblog: {
        type: objectId,
        ref: 'Blog',
        required: true
    },
    replyCounter: {
        type: Number,
        default: 0
    },
    replys: [{
        type: objectId,
        ref: 'Reply'
    }]
});

const Comment = mongoose.model('Comment', Commentschmea);

module.exports.Comment = Comment;