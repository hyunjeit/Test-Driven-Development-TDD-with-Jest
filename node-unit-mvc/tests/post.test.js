const sinon = require('sinon');
const PostModel = require('../models/post.model');
const PostController = require('../controllers/post.controller');

describe('Post controller', () => {
    let req = {
        body: {
            author: 'stswenguser',
            title: 'My first test post',
            content: 'Random content'
        }
    };

    let error = new Error({ error: 'Some error message' });

    let res = {};

    let expectedResult;

    
    describe('create', () => {
        var createPostStub;

        beforeEach(() => {

            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
        });

        afterEach(() => {

            createPostStub.restore();
        });


        it('should return the created post object', () => {

            expectedResult = {
                _id: '507asdghajsdhjgasd',
                title: 'My first test post',
                content: 'Random content',
                author: 'stswenguser',
                date: Date.now()
            };

            createPostStub = sinon.stub(PostModel, 'createPost').yields(null, expectedResult);

            PostController.create(req, res);

            sinon.assert.calledWith(PostModel.createPost, req.body);
            sinon.assert.calledWith(res.json, sinon.match({ title: req.body.title }));
            sinon.assert.calledWith(res.json, sinon.match({ content: req.body.content }));
            sinon.assert.calledWith(res.json, sinon.match({ author: req.body.author }));

        });


        it('should return status 500 on server error', () => {

            createPostStub = sinon.stub(PostModel, 'createPost').yields(error);

            PostController.create(req, res);

            sinon.assert.calledWith(PostModel.createPost, req.body);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        });
    });

    describe('update', () => {
        let updatePostStub;

        beforeEach(() => {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
        });

        afterEach(() => {
            if (updatePostStub && updatePostStub.restore) {
                updatePostStub.restore();
            }
        });

        it('should update a post and return the updated object', () => {

            const id = 'post-123';
            const updated = {
                author: req.body.author,
                title: 'Updated title',
                content: req.body.content,
                _id: id
            };
            updatePostStub = sinon.stub(PostModel, 'updatePost').yields(null, updated);

            PostController.update({ params: { id }, body: req.body }, res);

            sinon.assert.calledWith(PostModel.updatePost, id, req.body);
            sinon.assert.calledWith(res.json, updated);
        });

        it('should return status 500 on server error', () => {

            const id = 'post-123';
            updatePostStub = sinon.stub(PostModel, 'updatePost').yields(error);

            PostController.update({ params: { id }, body: req.body }, res);

            sinon.assert.calledWith(PostModel.updatePost, id, req.body);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        });
    });

    describe('findPost', () => {
        let findPostStub;

        beforeEach(() => {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
        });

        afterEach(() => {
            if (findPostStub && findPostStub.restore) {
                findPostStub.restore();
            }
        });

        it('should find and return a post by id', () => {

            const id = 'post-123';
            const expectedPost = {
                _id: id,
                title: 'Test Post',
                content: 'Test Content',
                author: 'stswenguser',
                date: Date.now()
            };
            findPostStub = sinon.stub(PostModel, 'findPost').yields(null, expectedPost);

            PostController.findPost({ params: { id } }, res);

            sinon.assert.calledWith(PostModel.findPost, id);
            sinon.assert.calledWith(res.json, expectedPost);
        });

        it('should return 404 when post is not found', () => {

            const id = 'nonexistent-123';
            findPostStub = sinon.stub(PostModel, 'findPost').yields(null, null);

            PostController.findPost({ params: { id } }, res);

            sinon.assert.calledWith(PostModel.findPost, id);
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledOnce(res.status(404).end);
        });

        it('should return 500 on server error', () => {

            const id = 'post-123';
            findPostStub = sinon.stub(PostModel, 'findPost').yields(error);

            PostController.findPost({ params: { id } }, res);

            sinon.assert.calledWith(PostModel.findPost, id);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        });        
    });

    describe('getAllPosts', () => {
        let getAllPostsStub;

        beforeEach(() => {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
        });

        afterEach(() => {
            if (getAllPostsStub && getAllPostsStub.restore) {
                getAllPostsStub.restore();
            }
        });

        it('should return all posts', () => {
            const expectedPosts = [
                {
                    _id: 'post-123',
                    title: 'First Post',
                    content: 'First content',
                    author: 'user1',
                    date: Date.now()
                },
                {
                    _id: 'post-456',
                    title: 'Second Post',
                    content: 'Second content',
                    author: 'user2',
                    date: Date.now()
                }
            ];

            getAllPostsStub = sinon.stub(PostModel, 'getAllPosts').yields(null, expectedPosts);

            PostController.getAllPosts(req, res);

            sinon.assert.calledWith(PostModel.getAllPosts);
            sinon.assert.calledWith(res.json, expectedPosts);
        });

        it('should return empty array when no posts exist', () => {
            const emptyPosts = [];

            getAllPostsStub = sinon.stub(PostModel, 'getAllPosts').yields(null, emptyPosts);

            PostController.getAllPosts(req, res);

            sinon.assert.calledWith(PostModel.getAllPosts);
            sinon.assert.calledWith(res.json, emptyPosts);
        });

        it('should return status 500 on server error', () => {
            getAllPostsStub = sinon.stub(PostModel, 'getAllPosts').yields(error);

            PostController.getAllPosts(req, res);

            sinon.assert.calledWith(PostModel.getAllPosts);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        });
    });

    describe('deletePost', () => {
        let deletePostStub;
        let req = { params: { id: 'post-123' } }; 
        let res = {};

        let error = new Error({ error: 'Some error message' });

        beforeEach(() => {
            res = {
                json: sinon.spy(),
                end: sinon.spy(),
                status: sinon.stub().returnsThis() 
            };
        });

        afterEach(() => {
            if (deletePostStub && deletePostStub.restore) {
                deletePostStub.restore();
            }
        });

        it('should return status 200 and a success message when post is deleted', () => {
            const result = { acknowledged: true, deletedCount: 1 };

            deletePostStub = sinon.stub(PostModel, 'deletePost').yields(null, result);

            PostController.delete(req, res);

            sinon.assert.calledWith(PostModel.deletePost, req.params.id);

            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledWith(res.json, { message: 'Post deleted successfully' });
        });

        it('should return 404 if the post was not found', () => {
            const result = { acknowledged: true, deletedCount: 0 };

            deletePostStub = sinon.stub(PostModel, 'deletePost').yields(null, result);

            PostController.delete(req, res);

            sinon.assert.calledWith(PostModel.deletePost, req.params.id);

            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledOnce(res.status(404).end);
        });

        it('should return status 500 on server error', () => {
            deletePostStub = sinon.stub(PostModel, 'deletePost').yields(error);

            PostController.delete(req, res);

            sinon.assert.calledWith(PostModel.deletePost, req.params.id);

            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        });
    });

    describe('like', () => {
        var likePostStub;
        let req = { params: { id: 'post-123' } }; 
        let res = {};

        let error = new Error({ error: 'Some error message' });

        beforeEach(() => {
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
        });

        afterEach(() => {
            if (likePostStub && likePostStub.restore) {
                likePostStub.restore();
            }
        });

        it('should return the updated post object and a message "Post successfully liked"', () => {
            const expectedResult = {
                _id: 'post-123',
                title: 'My first test post',
                content: 'Random content',
                author: 'stswenguser',
                likes: 1,
                date: Date.now()
            };

            likePostStub = sinon.stub(PostModel, 'likePost').yields(null, expectedResult);

            PostController.like(req, res);

            sinon.assert.calledWith(PostModel.likePost, req.params.id);
            sinon.assert.calledWith(res.json, sinon.match({
                message: 'Post successfully liked',
                likes: expectedResult.likes
            }));
        });

        it('should return status 404 if the post was not found', () => {
            likePostStub = sinon.stub(PostModel, 'likePost').yields(null, null);

            PostController.like(req, res);

            sinon.assert.calledWith(PostModel.likePost, req.params.id);
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledOnce(res.status(404).end);
        });

        it('should return status 500 on server error', () => {
            likePostStub = sinon.stub(PostModel, 'likePost').yields(error);

            PostController.like(req, res);

            sinon.assert.calledWith(PostModel.likePost, req.params.id);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        });
    });
});