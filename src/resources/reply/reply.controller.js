const {Comment} = require('../comment/comment.model');
const {Reply} = require('./reply.model');
const mongoose = require("mongoose");


const addReply = async (req, res, next) => {
    const user = req.auth;
    const comment_id = mongoose.Types.ObjectId(req.body.comment_id);
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
                .status(500)
                .json("There is no Comment with this id.")
    }
    const {date, body} = req.body;
    const reply = new Reply({date, body});
    reply.user = user._id;
    reply.parentcomment = comment_id;
    comment.replys.push(reply._id);
    comment.replyCounter++;
    try {
        await reply.save();
        await comment.save();
    } catch(err) {
        console.log(err);
        return res
                .status(500)
                .json("some thing went wrong please try again later.");
    }
    return res.status(200).json({reply_id: reply._id});
};

const modifiyReply = async (req, res, next) => {
    const user = req.auth;
    
    const reply_id = mongoose.Types.ObjectId(req.params.id);
    const {body, date} = req.body;
    let reply;
    try {
        reply = await Reply.findById(reply_id);
    }catch(err) {
       console.log(err);
       return res
                .status(500)
                .json("some thing went wrong please try again later.");
    }
    if(!reply) {
        return res
                .status(500)
                .json("There is no reply with this id.")
    }
    if(String(reply.user._id) != String(user._id)) {
        return res
                .status(401)
                .json("you are not allowed to edit this reply.");
    }
    reply.body = body;
    reply.date = date;
    try{
        await reply.save();
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

const deleteReply = async (req, res, next) => {
    const user = req.auth;

    const reply_id = mongoose.Types.ObjectId(req.params.id);
    let reply;
    try {
        reply = await Reply.findById(reply_id);
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json("some thing went wrong please try again later.");
    }
    if (!reply){
        return res
                .status(500)
                .json("there is no reply with this id");
    }
    if (String(reply.user._id) != String(user._id)) {
        return res
                .status(500)
                .json("you are not allowed to delete this reply");
    }

    parentcomment = reply.parentcomment._id;
    if (parentcomment) {
        let comment;
        try {
            comment = await Comment.findById(parentcomment);
        } catch (err) {
            console.log(err);
            return res
                .status(500)
                .json("some thing went wrong please try again later.");
        }
        let idx;
        for (i in comment.replys)
            if (String(comment.replys[i]._id) === String(reply_id)) {
                idx = Number(i);
                break;
            }
        comment.replys.splice(idx, 1);
        comment.replyCounter--;
        try {
            await comment.save();
            await reply.deleteOne();
        } catch (err) {
            console.log(err);
            return res
                    .status(500)
                    .json("some thing went wrong please try again later.");
        }
    }
    return res
    .status(200)
    .json("The Reply Deleted Successfully");
};

const unAuthReplyDeletion = async (reply_id) => {
    let reply;
    try {
        reply = await Reply.findById(reply_id);
    } catch (err) {
        return {error: err,message: "Something went wrong please try again later."};
    }
    try {
        await reply.deleteOne();
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

const upvoteReply = async (req, res, next) => {
    const user = req.auth;
    const reply_id = mongoose.Types.ObjectId(req.params.id);
    let reply;
    try {
        reply = await Reply.findById(reply_id);
    } catch(err) {
        console.log(err);
        return res
                .status(500)
                .json("some thing went wrong please try again later.");
    }
    if(!reply) {
        return res
                .status(200)
                .json("there is no reply with this id.");
    }
    
    const isupovter = isvoter(reply.upvoters, user._id);     
    const isdownvoter = isvoter(reply.downvoters, user._id);     
    if (isupovter){
        reply.upvoters.splice(isupovter - 1, 1);
        reply.upvoteCounter--;
    }
    else if (isdownvoter) {
        reply.downvoters.splice(isdownvoter - 1, 1);
        reply.upvoters.push(user._id);
        reply.downvoteCounter--;
        reply.upvoteCounter++;
    }
    else {
        reply.upvoters.push(user._id);
        reply.upvoteCounter++;
    }

    try{
        await reply.save();
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("some thing went wrong please try again later.");
    }
    return res.status(200).json("your request has been done");
};

const DownvoteReply = async (req, res, next) => {
    const user = req.auth;
    const reply_id = mongoose.Types.ObjectId(req.params.id);
    let reply;
    try {
        reply = await Reply.findById(reply_id);
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("some thing went wrong please try again later.");
    }
    if(!reply) {
        return res
                .status(200)
                .json("there is no reply with this id.");
    }

    const isupovter = isvoter(reply.upvoters, user._id);     
    const isdownvoter = isvoter(reply.downvoters, user._id);     
    if (isupovter) {
        reply.upvoters.splice(isupovter - 1, 1);
        reply.downvoters.push(user._id);
        reply.upvoteCounter--;
        reply.downvoteCounter++;
    }
    else if (isdownvoter) {
        reply.downvoters.splice(isdownvoter - 1, 1);
        reply.downvoteCounter--;
    }
    else {
        reply.downvoters.push(user._id);
        reply.downvoteCounter++;
    }

    try{
        await reply.save();
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

const getReplyVotesNumber = async (req, res, next) => {
    const reply_id = mongoose.Types.ObjectId(req.params.id);
    let reply;
    try {
        reply = await Reply.findById(reply_id);
    } catch (err) {
        console.log(err);
        return res
                .status(500)
                .json("Something went wrong please try later.");
    }
    if (!reply)
        return res
                .status(500)
                .json("there is no reply with this id");
    return res
            .status(200)
            .json({upvotes: reply.upvoters.length, donwvotes: reply.downvoters.length});
};

const userStatus = async (req, res, next) => {
    const user = req.auth;
    if (!user)
        user._id = 0;

    const reply_id = mongoose.Types.ObjectId(req.params.id);
    let reply;
    try {
        reply = await Reply.findById(reply_id);
    } catch(err) {
        console.log(err);
        return res
                .status(500)
                .json("some thing went wrong please try again later.");
    }
    if(!reply) {
        return res
                .status(200)
                .json("there is no reply with this id.");
    }
    const isowner = String(user._id) == String(reply.user._id);
    const isupovter = isvoter(reply.upvoters, user._id);     
    const isdownvoter = isvoter(reply.downvoters, user._id);     
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
    addReply,
    modifiyReply,
    deleteReply,
    unAuthReplyDeletion,
    upvoteReply,
    DownvoteReply,
    getReplyVotesNumber,
    userStatus
};