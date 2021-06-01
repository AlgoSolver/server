const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;

const Replyschmea = new mongoose.Schema({
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
    parentcomment: {
        type: objectId,
        ref: 'Comment',
        required: true
    }
});

const Reply = mongoose.model('Reply', Replyschmea);


module.exports.Reply = Reply;