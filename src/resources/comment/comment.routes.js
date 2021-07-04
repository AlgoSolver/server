const express = require('express');
const router  = express.Router();
const commentValidator = require("./comment.validator");
const commentController = require("./comment.controller");
const auth_guard = require("../_global-middlewares/auth-guard");

router.post("", auth_guard, commentValidator.validateComment, commentController.addComment);// add comment

router
    .route("/:id")
    .patch(auth_guard, commentValidator.validateCommentId, commentValidator.validateComment, commentController.modifiyComment)// Modifiy comment
    .delete(auth_guard, commentValidator.validateCommentId, commentController.deleteComment);// delete comment


router.patch("/:id/upvote", auth_guard, commentValidator.validateCommentId, commentController.upvoteComment);// upvote 
router.patch("/:id/downvote", auth_guard, commentValidator.validateCommentId, commentController.downvoteComment);// downvote
router.get("/:id/userstatus", commentController.userStatus);//get voter status upvoter or down

router.get("/:id/votesnumber", commentValidator.validateCommentId, commentController.getCommentVotesNumber);// # of votes
module.exports = router;