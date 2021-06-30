const {check, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const User = require('../models/User');
const sendServerError = require('./common');
 
const validatePost = [
    check('text', 'Text is required').not().isEmpty()
];

const validateComment = [
    check('text', 'Text is required').not().isEmpty()
];

const createPost = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post ({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        return res.json(post);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
    
};


const getAllPosts = async (req, res) => {
    try {
        //Get all posts starting with the most recent ones
        const posts = await Post.find().sort({ date: -1});
        res.json(posts);
    } catch (err) {
        sendServerError;
    }
    
};


const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post) {
            return res.status(404).json({msg: 'Post not found'});
        }
        res.json(post);
    } catch (err) {
        if(err.kind == 'ObjectId') {
            return res.status(404).json({msg: 'Post not found'});
        }
        sendServerError;
    }
    
};


const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post) {
            return res.status(404).json({msg: 'Post not found'});
        }
        //Check if the user owns the post
        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'This user is not authorized to delete this post'})
        }

        await post.remove();
        res.json({msg: 'Post removed'})

    } catch (err) {
        if(err.kind == 'ObjectId') {
            return res.status(404).json({msg: 'Post not found'});
        }
        sendServerError;
    }
    
};

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

    //Check if the post is already liked
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        return res.status(404).json({msg: 'Post already liked'});
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();
    return res.json(post.likes);
    
    } catch (err) {
        sendServerError;
    }
    
};

const unlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

    //Check if the post is already liked
    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
        return res.status(404).json({msg: 'Post has not been liked yet'});
    }
    
    //Get remove index
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();
    return res.json(post.likes);
    
    } catch (err) {
        sendServerError;
    }
    
};

const addComment = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.post_id);
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };
        
        post.comments.unshift(newComment);
        await post.save();
        return res.json(post.comments);
    } catch (err) {
        sendServerError;
    }
};



const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if(!post) {
            return res.status(404).json({msg: 'Post not found'});
        }

        //Pull comment from post
        const comment = await post.comments.find(comment => comment.id === req.params.comment_id);

        //Check if comment exists
        if(!comment) {
            return res.status(404).json({msg: 'Comment does not exist'})
        }

        //Check if the user posted the comment
        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'This user is not authorized to delete this comment'})
        }

        //Get remove index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);

        await post.save();
        return res.json(post.comments);

    } catch (err) {
        if(err.kind == 'ObjectId') {
            return res.status(404).json({msg: 'Post not found'});
        }
        sendServerError;
    }
};
module.exports = {
    validatePost, 
    validateComment,
    createPost, 
    getAllPosts, 
    getPostById, 
    deletePost, 
    likePost, 
    unlikePost,
    addComment,
    deleteComment
};