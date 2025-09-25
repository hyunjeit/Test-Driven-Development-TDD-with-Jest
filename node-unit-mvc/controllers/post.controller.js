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

};

PostController.getAllPosts = (req, res) => {

};

module.exports = PostController;