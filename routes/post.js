const router = require('express').Router();
const pool = require('../dbconfig');
const Authorize = require('../middleware/Authorize');
const postController = require('../controller/postController');


router.get('/useid:id',postController.getPostById);

router.get('/allpost',postController.getAllPost);

router.get('/postdata/:id',postController.getPostData);

router.use(Authorize);

router.get('/useemail',postController.getPostByEmail);

router.post('/comment',postController.commentOnPost);

router.put("/:id",postController.updatePost);

router.delete('/:id',postController.deletePost);

router.put("/upvote/:id",postController.upvotePost);

router.put('/bookmark/:id',postController.bookmarkPost);

module.exports = router;