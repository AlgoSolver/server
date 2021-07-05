const {Blog} = require('./blog.model');
const {unAuthCommentDeletion} = require('../comment/comment.controller');
const mongoose = require("mongoose");

const blogsPerPage = 5;

const addBlog = async (req, res, next) => {
    const user = req.auth;
    const {content, tags, title} = req.body;
    console.log( tags, title, user._id);
    // const blog = new Blog({title, tags, body,user: user._id});
    // try{
    //     await blog.save();
    // } catch(err) {
    //     console.log(err);
    //     return res
    //     .status(500)
    //     .json("some thing went wrong please try again later.");
    // }
    //
    // return res
    // .status(200)
    //.json({Blog_id: blog._id});
    return res
    .status(200)
    .json({messgae: 'success'});
};

const modifiyBlog = async (req, res, next) => {
    const user = req.auth;
    const blog_id = mongoose.Types.ObjectId(req.params.id);
    const {title, date, tags, body} = req.body;
    let blog;
    try {
        blog = await Blog.findById(blog_id);
    }catch(err) {
       console.log(err);
       return res
       .status(500)
       .json("some thing went wrong please try again later.");
    }
    if(!blog) {
        return res
        .status(500)
        .json("There is no Blog with this id.")
    }
    if(String(blog.user._id) != String(user._id)) {
        return res
                .status(401)
                .json("you are not allowed to edit this blog.");
    }

    blog.title = title;
    blog.tags = tags;
    blog.body = body;
    blog.date = date;
    try{
        await blog.save();
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("some thing went wrong please try again later.");
    }
    return res.status(200).json("The Blog Modifiyed Successfully");
};

const deleteBlog = async (req, res, next) => {
    const user = req.auth;
    const blog_id = mongoose.Types.ObjectId(req.params.id);
    let blog;
    try {
        blog = await Blog.findById(blog_id).populate('user');
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("something went wrong please try again later.");
    }
    if(!blog) {
        return res
        .status(500)
        .json("there is no blog with this id.");
    }
    if (String(blog.user._id) != String(user._id)) {
        return res
                .status(500)
                .json("you are not allowed to delete this blog");
    }

    for (i in blog.comments) {
       let result = await unAuthCommentDeletion(blog.comments[i]._id);
       if (result) {
           console.log(result.error);
           return res
                    .status(500)
                    .json(result.message);
       }
    }

    try {
        await blog.deleteOne();
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("something went wrong please try again later.");
    }
    return res
            .status(200)
            .json("The Blog Deleted Successfully");
};

const getBlogbyId = async (req, res, next) => {
    const blog_id = mongoose.Types.ObjectId(req.params.id);
    let blog;
    try {
        blog = await Blog.findById(blog_id)
                        .select("-upvoters -downvoters")
                        .populate({
                            path: 'comments',
                            select: '-upvoters -downvoters -parentblog',
                            populate: {
                                path: 'user',
                                select: 'username role'

                            },populate: {
                                path: 'replys',
                                select: '-upvoters -downvoters -parentcomment',
                                populate: {
                                    path: 'user',
                                    select: 'username role'
                                }
                            }
                        })
                        .populate('user', 'username role');
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

    return res
            .status(200)
            .json({blog: blog});
};

const getBlogsbyPage = async (req, res, next) => {
    let NumberofPages = 0, NumberofDocuments = 0;
    let pagenumber = Number(req.query.page);
    console.log(pagenumber);
    if(isNaN(pagenumber))
        pagenumber = 1;

    let blogs;
    try {
        blogs = await Blog
                    .find({})
                    .skip((pagenumber - 1) * blogsPerPage)
                    .limit(blogsPerPage)
                    .select("-upvoters -downvoters -comments -body")
                    .populate("user", "username role");
        NumberofDocuments = await Blog.find({}).count();
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("Something went wrong please try later.");
    }
    NumberofPages = Math.ceil(NumberofDocuments/blogsPerPage);
    const blogsNumber = Math.min(Math.max((NumberofDocuments - (pagenumber - 1) * blogsPerPage), 0), blogsPerPage);
    return res
        .status(200)
        .json({
            totalBlogs: NumberofDocuments,
            totalPages: NumberofPages,
            blogsNumber: blogsNumber,
            Blogs: blogs});
};

const getNumberofBlogpages = async (req, res, next) => {
    let NumberofPages = 0, NumberofDocuments;
    try {
        NumberofDocuments = await Blog.find({}).count();
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("Something went wrong please try later.");
    }
    NumberofPages = Math.ceil(NumberofDocuments/blogsPerPage);
    return res
        .status(200)
        .json({NumberofPages: NumberofPages});
};

const getBlogsbyTags = async (req, res, next) => {
    let NumberofPages = 0, NumberofDocuments = 0;
    let pagenumber = Number(req.query.page);
    if(isNaN(pagenumber) || pagenumber <= 0)
        pagenumber = 1;

    const tags = req.query.tags.split(' ');
    console.log(tags);
    let blogs;
    try {
        blogs = await Blog.find({tags: {$in: tags}})
                            .skip((pagenumber - 1) * blogsPerPage)
                            .limit(blogsPerPage)
                            .select("-upvoters -downvoters -comments -body")
                            .populate('user', 'username role');
        NumberofDocuments = await Blog.find({tags: {$in: tags}}).count();
    } catch(err) {
        console.log(err);
        return res
                .status(500)
                .json("Something went wrong please try later.");
    }
    NumberofPages = Math.ceil(NumberofDocuments/blogsPerPage);
    const blogsNumber = Math.min(Math.max((NumberofDocuments - (pagenumber - 1) * blogsPerPage), 0), blogsPerPage);
    return res
        .status(200)
        .json({
            totalBlogs: NumberofDocuments,
            totalPages: NumberofPages,
            blogsNumber: blogsNumber,
            Blogs: blogs});
};

const isvoter = (voters, user_id) => {
    for (i in voters)
        if (String(voters[i]) == String(user_id))
            return Number(i) + 1;
    return 0;
};

const upvoteBlog = async (req, res, next) => {
    const user = req.auth;

    const blog_id = mongoose.Types.ObjectId(req.params.id);
    let blog;
    try {
        blog = await Blog.findById(blog_id);
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("Something went wrong please try later.");
    }
    if(!blog)
        return res
                .status(500)
                .json("there is no blog with this id");

    const isupovter = isvoter(blog.upvoters, user._id);
    const isdownvoter = isvoter(blog.downvoters, user._id);
    if (isupovter){
        blog.upvoters.splice(isupovter - 1, 1);
        blog.upvoteCounter--;
    }
    else if (isdownvoter) {
        blog.downvoters.splice(isdownvoter - 1, 1);
        blog.upvoters.push(user._id);
        blog.downvoteCounter--;
        blog.upvoteCounter++;
    }
    else {
        blog.upvoters.push(user._id);
        blog.upvoteCounter++;
    }

    try {
        await blog.save();
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("Something went wrong please try later.");
    }
    return res
            .status(200)
            .json("your request has been done");
};

const donwvoteBlog = async (req, res, next) => {
    const user = req.auth;
    const blog_id = mongoose.Types.ObjectId(req.params.id);
    let blog;
    try {
        blog = await Blog.findById({_id: blog_id});
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("Something went wrong please try later.");
    }
    if(!blog)
        return res
                .status(500)
                .json("there is no blog with this id");

    const isupovter = isvoter(blog.upvoters, user._id);
    const isdownvoter = isvoter(blog.downvoters, user._id);
    if (isupovter) {
        blog.upvoters.splice(isupovter - 1, 1);
        blog.downvoters.push(user._id);
        blog.upvoteCounter--;
        blog.downvoteCounter++;
    }
    else if (isdownvoter) {
        blog.downvoters.splice(isdownvoter - 1, 1);
        blog.downvoteCounter--;
    }
    else {
        blog.downvoters.push(user._id);
        blog.downvoteCounter++;
    }

    try {
        await blog.save();
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("Something went wrong please try later.");
    }
    return res
            .status(200)
            .json("your request has been done");
};

const getBlogvotes = async (req, res, next) => {
    const blog_id = mongoose.Types.ObjectId(req.params.id);

    let blog;
    try {
        blog = await Blog.findById(blog_id);
    } catch (err) {
        console.log(err);
        return res
                .status(500)
                .json("Something went wrong please try later.");
    }
    if (!blog)
        return res
                .status(500)
                .json("there is no blog with this id");

    return res
            .status(200)
            .json({upvotes: blog.upvoters.length, donwvotes: blog.downvoters.length});
};

const userStatus = async (req, res, next) => {
    const user = req.auth;
    if (!user)
        user._id = 0;

    const blog_id = mongoose.Types.ObjectId(req.params.id);
    let blog;
    try {
        blog = await Blog.findById({_id: blog_id});
    } catch(err) {
        console.log(err);
        return res
        .status(500)
        .json("Something went wrong please try later.");
    }
    if(!blog)
        return res
                .status(500)
                .json("there is no blog with this id");

    const isowner = String(user._id) == String(blog.user._id);
    const isupovter = isvoter(blog.upvoters, user._id);
    const isdownvoter = isvoter(blog.downvoters, user._id);
    let voterstatus = 0;
    if (isupovter)
        voterstatus = 1;
    else if (isdownvoter)
        voterstatus = -1;

    return res
            .status(200)
            .json({voterstatus: voterstatus,
                   isowner: isowner });
}

module.exports = {
    addBlog,
    modifiyBlog,
    deleteBlog,
    getBlogbyId,
    getBlogsbyPage,
    getNumberofBlogpages,
    getBlogsbyTags,
    upvoteBlog,
    donwvoteBlog,
    getBlogvotes,
    userStatus
};
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzbGFtZ2hhbnkzQGdtYWlsLmNvbSIsInVzZXJJZCI6IjYwMTE0YWY1NjllNDg0M2QzNGY5ZDcwOCIsInVzZXJuYW1lIjoiaXNsYW1naGFueSIsImlhdCI6MTYxOTM3Mjg4NiwiZXhwIjoxNjUwOTA4ODg2fQ.ICxqQKtGl1W4o7SAzs0OB8zb_D4JjcT8i5xJ6ndU2NQ
