const express = require('express');
const router  = express.Router();
const blogValidator = require("./blog.validator");
const blogController = require("./blog.controller");
const auth_guard = require("../_global-middlewares/auth-guard");

router
    .route("")
    .get(blogController.getBlogsbyPage)//get blogs first page
    .post(auth_guard , blogController.addBlog);// add blog

router.get("/numberofpages",blogController.getNumberofBlogpages);// get # of pages
router.get("/taged", blogValidator.validateblogtags, blogController.getBlogsbyTags);//get blogs by tags

router
    .route("/:id")
    .get(blogController.getBlogbyId)//get blog by id
    .patch(auth_guard, blogValidator.validateblogId, blogValidator.validateblog ,blogController.modifiyBlog)//Modifiy Blg
    .delete(auth_guard, blogValidator.validateblogId, blogController.deleteBlog);//delete blog



router.patch("/:id/upvote", auth_guard, blogValidator.validateblogId, blogController.upvoteBlog);//upvote
router.patch("/:id/downvote", auth_guard, blogValidator.validateblogId, blogController.donwvoteBlog);//downvote

router.get("/:id/votes", blogController.getBlogvotes);//get # of vote
router.get("/:id/userstatus", blogController.userStatus);//get voter status

module.exports = router;
