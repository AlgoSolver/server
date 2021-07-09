const mongoose = require('mongoose');

const objectId = mongoose.Schema.Types.ObjectId;

const Blogschmea = new mongoose.Schema({
    header: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: objectId,
        ref: 'User',
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    content: {
        type: String,
        required:true,
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
