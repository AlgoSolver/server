const mongoose = require('mongoose');

const objectId = mongoose.Schema.Types.ObjectId;

const Commentschmea = new mongoose.Schema({
    author: {
        type: objectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    
    article: {
        type: objectId,
        ref: 'Blog',
        required: true
    }
},{timestamps:true});

const Comment = mongoose.model('Comment', Commentschmea);

module.exports.Comment = Comment;