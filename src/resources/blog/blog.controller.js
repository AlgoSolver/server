const { Blog } = require("./blog.model");
const { unAuthCommentDeletion } = require("../comment/comment.controller");
const mongoose = require("mongoose");
const Tag = require('../tag/tag.model');
const blogsPerPage = 20;


const addBlog = async (req, res, next) => {
    const user = req.auth;
    let { content, tags, header } = req.body;
    header = header.toLowerCase();
    let blogHeaderExist;
    try{
        blogHeaderExist = await Blog.findOne({header});
    }catch(err){
        return res
            .status(500)
            .json("some thing went wrong please try again later.");
    }
    if(blogHeaderExist){
        return res
            .status(400)
            .json("This Header is Already Taken, place provide another header");
    }
    //console.log( tags, header, user._id);
    const blog = new Blog({ header, tags, content, author: user._id });

    const createdTags = tags.map( async (tag)=>{
        let tagExist;
        try{
            tagExist = await Tag.findOne({name:tag});
        }catch(err){}
        if(tagExist) {
            tagExist.articles.push(blog._id);
            return tagExist;
        }
         return new Tag({name:tag,articles:[blog._id]});
    });
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        let x = await Promise.all(createdTags)
        for(let t of x){
            await t.save(session)
        }
        await blog.save(session)
        await session.commitTransaction();
        session.endSession();
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json("some thing went wrong please try again later.");
    }

    return res.status(200).json({ id:blog._id });
};
const getBlogComments = async (req, res) => {
    const {id} = req.params;
    let blog;
    try{
        blog = await Blog.findById(id).populate({
            path:"comments",
            model:"Comment",
            select:"author body createdAt",
			populate:{
				path:'author',
				select:"username role imgURL",
				model:"User",
			}
        });
    }catch(err){
        console.log(err);
        return res
        .status(500)
        .json("there is no records for this article.");
    }
    res.json(blog?.comments || []);
}
const getBlogsbyPage = async (req, res, next) => {
    let NumberofPages = 0,
        NumberofDocuments = 0;
    let pagenumber = Number(req.query.page);
    let keyword = req.query.keyword;
    if (isNaN(pagenumber)) pagenumber = 1;

    let blogs;
    try {
        blogs = await Blog.find(keyword ? {header:{$regex:keyword.toLowerCase()}} : {})
            .sort({
                createdAt:-1
            })
            .skip((pagenumber - 1) * blogsPerPage)
            .limit(blogsPerPage)
            .select("-title -comments -body")
            .populate("author", "username role imgURL");
        NumberofDocuments = await Blog.find({}).count();
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong please try later.");
    }
    NumberofPages = Math.ceil(NumberofDocuments / blogsPerPage);
    const blogsNumber = Math.min(
        Math.max(NumberofDocuments - (pagenumber - 1) * blogsPerPage, 0),
        blogsPerPage
    );
    return res.status(200).json({
        totalBlogs: NumberofDocuments,
        totalPages: NumberofPages,
        blogsNumber: blogsNumber,
        Blogs: blogs,
    });
};

const getNumberofBlogpages = async (req, res, next) => {
    let NumberofPages = 0,
        NumberofDocuments;
    try {
        NumberofDocuments = await Blog.find({}).count();
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong please try later.");
    }
    NumberofPages = Math.ceil(NumberofDocuments / blogsPerPage);
    return res.status(200).json({ NumberofPages: NumberofPages });
};

const getBlogbyId = async (req, res, next) => {
    let blog;
    try {
        blog = await Blog.findById(req.params.id)
            .populate("author", "username role imgURL");
    } catch (err) {
        return res.status(404).json({ found: false });
    }

    if (!blog) return res.status(404).json({ found: false });

    return res.status(200).json({ blog: blog, found: true });
};

const modifiyBlog = async (req, res, next) => {
    const user = req.auth;
    const blog_id = mongoose.Types.ObjectId(req.params.id);
    const { title, date, tags, body } = req.body;
    let blog;
    try {
        blog = await Blog.findById(blog_id);
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json("some thing went wrong please try again later.");
    }
    if (!blog) {
        return res.status(500).json("There is no Blog with this id.");
    }
    if (String(blog.user._id) != String(user._id)) {
        return res.status(401).json("you are not allowed to edit this blog.");
    }

    blog.title = title;
    blog.tags = tags;
    blog.body = body;
    blog.date = date;
    try {
        await blog.save();
    } catch (err) {
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
        blog = await Blog.findById(blog_id).populate("user");
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json("something went wrong please try again later.");
    }
    if (!blog) {
        return res.status(500).json("there is no blog with this id.");
    }
    if (String(blog.user._id) != String(user._id)) {
        return res.status(500).json("you are not allowed to delete this blog");
    }

    for (i in blog.comments) {
        let result = await unAuthCommentDeletion(blog.comments[i]._id);
        if (result) {
            console.log(result.error);
            return res.status(500).json(result.message);
        }
    }

    try {
        await blog.deleteOne();
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json("something went wrong please try again later.");
    }
    return res.status(200).json("The Blog Deleted Successfully");
};

const getBlogsbyTags = async (req, res, next) => {
    let NumberofPages = 0,
        NumberofDocuments = 0;
    let pagenumber = Number(req.query.page);
    if (isNaN(pagenumber) || pagenumber <= 0) pagenumber = 1;

    const tags = req.query.tags.split(" ");
    console.log(tags);
    let blogs;
    try {
        blogs = await Blog.find({ tags: { $in: tags } })
            .skip((pagenumber - 1) * blogsPerPage)
            .limit(blogsPerPage)
            .select("-upvoters -downvoters -comments -body")
            .populate("user", "username role");
        NumberofDocuments = await Blog.find({ tags: { $in: tags } }).count();
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong please try later.");
    }
    NumberofPages = Math.ceil(NumberofDocuments / blogsPerPage);
    const blogsNumber = Math.min(
        Math.max(NumberofDocuments - (pagenumber - 1) * blogsPerPage, 0),
        blogsPerPage
    );
    return res.status(200).json({
        totalBlogs: NumberofDocuments,
        totalPages: NumberofPages,
        blogsNumber: blogsNumber,
        Blogs: blogs,
    });
};

const isvoter = (voters, user_id) => {
    for (i in voters)
        if (String(voters[i]) == String(user_id)) return Number(i) + 1;
    return 0;
};

const upvoteBlog = async (req, res, next) => {
    const user = req.auth;

    const blog_id = mongoose.Types.ObjectId(req.params.id);
    let blog;
    try {
        blog = await Blog.findById(blog_id);
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong please try later.");
    }
    if (!blog) return res.status(500).json("there is no blog with this id");

    const isupovter = isvoter(blog.upvoters, user._id);
    const isdownvoter = isvoter(blog.downvoters, user._id);
    if (isupovter) {
        blog.upvoters.splice(isupovter - 1, 1);
        blog.upvoteCounter--;
    } else if (isdownvoter) {
        blog.downvoters.splice(isdownvoter - 1, 1);
        blog.upvoters.push(user._id);
        blog.downvoteCounter--;
        blog.upvoteCounter++;
    } else {
        blog.upvoters.push(user._id);
        blog.upvoteCounter++;
    }

    try {
        await blog.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong please try later.");
    }
    return res.status(200).json("your request has been done");
};

const donwvoteBlog = async (req, res, next) => {
    const user = req.auth;
    const blog_id = mongoose.Types.ObjectId(req.params.id);
    let blog;
    try {
        blog = await Blog.findById({ _id: blog_id });
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong please try later.");
    }
    if (!blog) return res.status(500).json("there is no blog with this id");

    const isupovter = isvoter(blog.upvoters, user._id);
    const isdownvoter = isvoter(blog.downvoters, user._id);
    if (isupovter) {
        blog.upvoters.splice(isupovter - 1, 1);
        blog.downvoters.push(user._id);
        blog.upvoteCounter--;
        blog.downvoteCounter++;
    } else if (isdownvoter) {
        blog.downvoters.splice(isdownvoter - 1, 1);
        blog.downvoteCounter--;
    } else {
        blog.downvoters.push(user._id);
        blog.downvoteCounter++;
    }

    try {
        await blog.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong please try later.");
    }
    return res.status(200).json("your request has been done");
};

const getBlogvotes = async (req, res, next) => {
    const blog_id = mongoose.Types.ObjectId(req.params.id);

    let blog;
    try {
        blog = await Blog.findById(blog_id);
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong please try later.");
    }
    if (!blog) return res.status(500).json("there is no blog with this id");

    return res
        .status(200)
        .json({
            upvotes: blog.upvoters.length,
            donwvotes: blog.downvoters.length,
        });
};

const userStatus = async (req, res, next) => {
    const user = req.auth;
    if (!user) user._id = 0;

    const blog_id = mongoose.Types.ObjectId(req.params.id);
    let blog;
    try {
        blog = await Blog.findById({ _id: blog_id });
    } catch (err) {
        console.log(err);
        return res.status(500).json("Something went wrong please try later.");
    }
    if (!blog) return res.status(500).json("there is no blog with this id");

    const isowner = String(user._id) == String(blog.user._id);
    const isupovter = isvoter(blog.upvoters, user._id);
    const isdownvoter = isvoter(blog.downvoters, user._id);
    let voterstatus = 0;
    if (isupovter) voterstatus = 1;
    else if (isdownvoter) voterstatus = -1;

    return res.status(200).json({ voterstatus: voterstatus, isowner: isowner });
};

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
    userStatus,
    getBlogComments
};
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlzbGFtZ2hhbnkzQGdtYWlsLmNvbSIsInVzZXJJZCI6IjYwMTE0YWY1NjllNDg0M2QzNGY5ZDcwOCIsInVzZXJuYW1lIjoiaXNsYW1naGFueSIsImlhdCI6MTYxOTM3Mjg4NiwiZXhwIjoxNjUwOTA4ODg2fQ.ICxqQKtGl1W4o7SAzs0OB8zb_D4JjcT8i5xJ6ndU2NQ