const mongoose = require('mongoose');

const objectId = mongoose.Schema.Types.ObjectId;

const Blogschmea = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: objectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    tags: {
        type: [String],
        default: []
    },
    body: {
        type: String
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
    commentCounter: {
        type: Number,
        default: 0
    },
    comments: [{
        type: objectId,
        ref: 'Comment'
    }]
});

const Blog = mongoose.model('Blog', Blogschmea);
module.exports.Blog = Blog;