const express = require('express');
const router  = express.Router();
const replytValidator = require("./reply.validator");
const replyController = require("./reply.controller");
const auth_guard = require("../_global-middlewares/auth-guard");

router.post("", auth_guard, replytValidator.validateReply, replyController.addReply);//add reply

router
    .route("/:id")
    .patch(auth_guard, replytValidator.validateReplyId, replytValidator.validateReply, replyController.modifiyReply)//modifiy reply
    .delete(auth_guard, replytValidator.validateReplyId, replyController.deleteReply);//delete reply


router.patch("/:id/upvote",auth_guard, replytValidator.validateReplyId, replyController.upvoteReply);//upvote
router.patch("/:id/downvote",auth_guard, replytValidator.validateReplyId, replyController.DownvoteReply);//downvote

router.get("/:id/userstatus", replyController.userStatus);//get voter status upvoter or down
router.get("/:id/votesnumber", replytValidator.validateReplyId, replyController.getReplyVotesNumber);//votes number
module.exports = router;