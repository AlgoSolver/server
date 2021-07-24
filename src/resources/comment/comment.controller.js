const {Blog} = require('../blog/blog.model');
const {Comment} = require('./comment.model');
const mongoose = require("mongoose");
const {unAuthReplyDeletion} = require("../reply/reply.controller");


const addComment = async (req, res, next) => {
    const user = req.auth;
    const blog_id= req.body.id;
    let blog;
    try {
        blog = await Blog.findById(blog_id);
    } catch(err) {
        console.log(err);
        return res
                .status(500)
                .json("something went wrong please try again later.");
    }
    if(!blog)
        return res
                .status(500)
                .json("there is no blog with this id.");
    
    const {body} = req.body;
    const comment = new Comment({body,author:user._id, article:blog_id});
    blog.comments.push(comment._id);
    blog.commentCounter++;
    try{
        await blog.save();
        await comment.save();
    } catch(err) {
        console.log(err);
        return res
                .status(500)
                .json("some thing went wrong please try again later.");
    }

    return res
            .status(200)
            .json({comment});
};

const modifiyComment = async (req, res, next) => {
    const user = req.auth;
    
    const comment_id = mongoose.Types.ObjectId(req.params.id);
    const {body, date} = req.body;
    let comment;
    try {
        comment = await Comment.findById(comment_id);
    }catch(err) {
       console.log(err);
       return res
                .status(500)
                .json("some thing went wrong please try again later.");
    }
    if(!comment) {
        return res
                .status(500)
                .json("There is no Comment with this id.")
    }
    if(String(comment.user._id) != String(user._id)) {
        return res
                .status(401)
                .json("you are not allowed to edit this Comment.");
    }
    comment.body = body;
    comment.date = date;
    try{
        await comment.save();
    } catch(err) {
        console.log(err);
        return res
                .status(500)
                .json("some thing went wrong please try again later.");
    }
    return res
            .status(200)
            .json("The Comment Modifiyed Successfully");
};

const deleteComment = async (req, res, next) => {
    const user = req.auth;
    const comment_id = req.params.id;
    let comment;
    try {
        comment = await Comment.findById(comment_id);
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json("some thing went wrong please try again later.");
    }
    if (!comment){
        return res
                .status(500)
                .json("there is no comment with this id");
    }
    if (String(comment.user._id) != String(user._id)) {
        return res
                .status(500)
                .json("you are not allowed to delete this comment");
    }
    let blog;
    try {
        blog = await Blog.findById(comment.parentblog._id);
    } catch (err) {
        console.log(err);
        return res
                .status(500)
                .json("some thing went wrong please try again later.");
    }
    let idx;
    for (i in blog.comments) {
        if (String(blog.comments[i]._id) == String(comment_id)) {
            idx = Number(i);
            break;
        }
    }
    blog.comments.splice(idx, 1);
    blog.commentCounter--;
    try {
        await blog.save();
        await comment.deleteOne();
    } catch (err) {
        console.log(err);
        return res
                .status(500)
                .json("some thing went wrong please try again later.");
    }

    return res
            .status(200)
            .json("The Comment Deleted Successfully");
};

const unAuthCommentDeletion = async (comment_id) => {
    let comment;
    try {
        comment = await Comment.findById(comment_id);
    } catch (err) {
        return {error: err,message: "Something went wrong please try again later."};
    }

    let rlength = comment.replys.length;
    for (i = rlength - 1; i >= 0; i--) {
        let result = await unAuthReplyDeletion(comment.replys[i]._id);
        if (result) 
            return res;
    }

    try {
        await comment.deleteOne();
    } catch (err) {
        return {error: err,message: "Something went wrong please try again later."};
    }
};

const isvoter = (voters, user_id) => {
    for (i in voters)
        if (String(voters[i]) == String(user_id))
            return Number(i) + 1;
    return 0;
};

const upvoteComment = async (req, res, next) => {
    const user = req.auth;

    const comment_id = mongoose.Types.ObjectId(req.params.id);
    let comment;
    try {
        comment = await Comment.findById(comment_id);
    } catch(err) {
        console.log(err);
        return res
                .status(500)
                .json("some thing went wrong please try again later.");
    }
    if(!comment) {
        return res
                .status(200)
                .json("there is no comment with this id.");
    }
    
    const isupovter = isvoter(comment.upvoters, user._id);     
    const isdownvoter = isvoter(comment.downvoters, user._id);     
    if (isupovter){
        comment.upvoters.splice(isupovter - 1, 1);
        comment.upvoteCounter--;
    }
    else if (isdownvoter) {
        comment.downvoters.splice(isdownvoter - 1, 1);
        comment.upvoters.push(user._id);
        comment.downvoteCounter--;
        comment.upvoteCounter++;
    }
    else {
        comment.upvoters.push(user._id);
        comment.upvoteCounter++;
    }

    try{
        await comment.save();
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("some thing went wrong please try again later.");
    }
    return res.status(200).json("your request has been done");
};

const downvoteComment = async (req, res, next) => {
    const user = req.auth;
    const comment_id = mongoose.Types.ObjectId(req.params.id);
    let comment;
    try {
        comment = await Comment.findById(comment_id);
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("some thing went wrong please try again later.");
    }
    if(!comment) {
        return res
                .status(200)
                .json("there is no comment with this id.");
    }

    const isupovter = isvoter(comment.upvoters, user._id);     
    const isdownvoter = isvoter(comment.downvoters, user._id);     
    if (isupovter) {
        comment.upvoters.splice(isupovter - 1, 1);
        comment.downvoters.push(user._id);
        comment.upvoteCounter--;
        comment.downvoteCounter++;
    }
    else if (isdownvoter) {
        comment.downvoters.splice(isdownvoter - 1, 1);
        comment.downvoteCounter--;
    }
    else {
        comment.downvoters.push(user._id);
        comment.downvoteCounter++;
    }

    try{
        await comment.save();
    } catch(err) {
        console.log(err);
        return res
                .status(500)
                .json("some thing went wrong please try again later.");
    }
    return res
            .status(200)
            .json("your request has been done");
};

const getCommentVotesNumber = async (req, res, next) => {
    const comment_id = mongoose.Types.ObjectId(req.params.id);
    let comment;
    try {
        comment = await Comment.findById(comment_id);
    } catch (err) {
        console.log(err);
        return res
                .status(500)
                .json("Something went wrong please try later.");
    }
    if (!comment)
        return res
                .status(500)
                .json("there is no comment with this id");
    return res
            .status(200)
            .json({upvotes: comment.upvoters.length, donwvotes: comment.downvoters.length});
};

const userStatus = async (req, res, next) => {
    const user = req.auth;
    if (!user)
        user._id = 0;

    const comment_id = mongoose.Types.ObjectId(req.params.id);
    let comment;
    try {
        comment = await Comment.findById(comment_id);
    } catch(err) {
        console.log(err);
        return res
                .status(500)
                .json("some thing went wrong please try again later.");
    }
    if(!comment) {
        return res
                .status(200)
                .json("there is no comment with this id.");
    }
    const isowner = String(user._id) == String(comment.user._id);
    const isupovter = isvoter(comment.upvoters, user._id);     
    const isdownvoter = isvoter(comment.downvoters, user._id);
    let voterstatus = 0;
    if (isupovter) 
        voterstatus = 1;
    else if (isdownvoter)
        voterstatus = -1;
 
    return res
            .status(200)
            .json({voterstatus: voterstatus,
                   isowner: isowner });   
};

module.exports = {
    addComment,
    modifiyComment,
    deleteComment,
    unAuthCommentDeletion,
    upvoteComment,
    downvoteComment,
    getCommentVotesNumber,
    userStatus
};