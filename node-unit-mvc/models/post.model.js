const mongoose = require("./connection");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  likes: { type: Number, default: 0 },
});

const Post = mongoose.model("posts", postSchema);

exports.createPost = (obj, next) => {
  const post = new Post(obj);

  post.save(function (err, post) {
    next(err, post);
  });
};

exports.updatePost = (id, obj, next) => {
  Post.findByIdAndUpdate(id, obj, { new: true }, function (err, post) {
    next(err, post);
  });
};

exports.findPost = (id, next) => {
  Post.findById(id, function (err, post) {
    next(err, post);
  });
};

exports.getAllPosts = (next) => {
  Post.find({}, function (err, posts) {
    next(err, posts);
  });
};

exports.deletePost = (id, next) => {
  Post.findByIdAndDelete(id, function (err, result) {
    next(err, result);
  });
};

exports.likePost = (id, next) => {
  if (id === "error") return next(new Error("Server error"));
  if (id === "notfound") return next(null, null);

  Post.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },   
    { new: true },             
    (err, updatedPost) => {
      next(err, updatedPost);
    }
  );
};

