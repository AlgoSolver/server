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
    tags: {
        type: [String],
        default: []
    },
    body: {
        type: String
    },
    comments: [{
        type: objectId,
        ref: 'Comment'
    }]
},{
  timestamps:true
});

const Blog = mongoose.model('Blog', Blogschmea);
module.exports.Blog = Blog;
