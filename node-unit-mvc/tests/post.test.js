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


        // Error Scenario
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

});