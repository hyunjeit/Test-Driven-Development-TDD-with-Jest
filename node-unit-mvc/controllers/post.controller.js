const PostModel = require('../models/post.model');
const PostController = {};

PostController.create = (req, res) => {
    return PostModel.createPost(req.body, (err, post) => {
        if (err) {
            return res.status(500).end();
        } else {
            return res.json(post);
        }
    })

};

PostController.update = (req, res) => {
    const { id } = req.params;
    PostModel.updatePost(id, req.body, (err, updatedPost) => {
        if (err) {
            return res.status(500).end();
        }
        if (!updatedPost) {
            return res.status(404).end();
        }
        return res.json(updatedPost);
    });
};

PostController.findPost = (req, res) => {
    const { id } = req.params;
    PostModel.findPost(id, (err, post) => {
        if (err) {
            return res.status(500).end();
        }
        if (!post) {
            return res.status(404).end();
        }
        return res.json(post);
    });
};

PostController.getAllPosts = (req, res) => {
    PostModel.getAllPosts((err, posts) => {
        if (err) {
            return res.status(500).end();
        }
        if (!posts) {
            return res.status(404).end();
        }
        return res.json(posts);
    });
};

PostController.delete = (req, res) => {
    const { id } = req.params;
    PostModel.deletePost(id, (err, result) => {
        if (err) {
            return res.status(500).end();
        }
        if (!result || result.deletedCount === 0) {
            return res.status(404).end();
        }
        return res.status(200).json({message: 'Post deleted successfully'});
    });
};

module.exports = PostController;