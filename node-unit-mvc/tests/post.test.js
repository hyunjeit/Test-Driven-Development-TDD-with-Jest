const sinon = require('sinon');
const PostModel = require('../models/post.model');
const PostController = require('../controllers/post.controller');

describe('Post controller', () => {
    // Setup the responses
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
            // before every test case setup first
            res = {
                json: sinon.spy(),
                status: sinon.stub().returns({ end: sinon.spy() })
            };
        });

        afterEach(() => {
            // executed after the test case
            createPostStub.restore();
        });


        it('should return the created post object', () => {
            // Arrange
            expectedResult = {
                _id: '507asdghajsdhjgasd',
                title: 'My first test post',
                content: 'Random content',
                author: 'stswenguser',
                date: Date.now()
            };

            createPostStub = sinon.stub(PostModel, 'createPost').yields(null, expectedResult);

            // Act
            PostController.create(req, res);

            // Assert
            sinon.assert.calledWith(PostModel.createPost, req.body);
            sinon.assert.calledWith(res.json, sinon.match({ title: req.body.title }));
            sinon.assert.calledWith(res.json, sinon.match({ content: req.body.content }));
            sinon.assert.calledWith(res.json, sinon.match({ author: req.body.author }));

        });


        // Error Scenario
        it('should return status 500 on server error', () => {
            // Arrange
            createPostStub = sinon.stub(PostModel, 'createPost').yields(error);

            // Act
            PostController.create(req, res);

            // Assert
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
            // Arrange
            const id = 'post-123';
            const updated = {
                author: req.body.author,
                title: 'Updated title',
                content: req.body.content,
                _id: id
            };
            updatePostStub = sinon.stub(PostModel, 'updatePost').yields(null, updated);

            // Act
            PostController.update({ params: { id }, body: req.body }, res);

            // Assert
            sinon.assert.calledWith(PostModel.updatePost, id, req.body);
            sinon.assert.calledWith(res.json, updated);
        });

        it('should return status 500 on server error', () => {
            // Arrange
            const id = 'post-123';
            updatePostStub = sinon.stub(PostModel, 'updatePost').yields(error);

            // Act
            PostController.update({ params: { id }, body: req.body }, res);

            // Assert
            sinon.assert.calledWith(PostModel.updatePost, id, req.body);
            sinon.assert.calledWith(res.status, 500);
            sinon.assert.calledOnce(res.status(500).end);
        });
    });



    describe('findPost', () => {

    })
});