const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
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
} = require('../../controllers/posts');



// @POST api/posts
// @desc create a post
// @access private
router.post('/', [auth, validatePost], createPost);



// @GET api/posts
// @desc get all posts
// @access private
router.get('/', auth, getAllPosts);



// @GET api/posts/:post_id
// @desc get post by id
// @access private
router.get('/:post_id', auth, getPostById);



// @DELETE api/posts/:post_id
// @desc delete post by id
// @access private
router.delete('/:post_id', auth, deletePost);



// @PUT api/posts/:post_id/like
// @desc like post by id
// @access private
router.put('/:post_id/like', auth, likePost);



// @PUT api/posts/:post_id/unlike
// @desc unlike post by id
// @access private
router.put('/:post_id/unlike', auth, unlikePost);



// @POST api/posts/:post_id/comment
// @desc add comment to post
// @access private
router.post('/:post_id/comments', [auth, validateComment], addComment);



// @DELETE api/posts/:post_id/comment
// @desc delete comment from post
// @access private
router.delete('/:post_id/comments/:comment_id', auth, deleteComment);



module.exports = router;