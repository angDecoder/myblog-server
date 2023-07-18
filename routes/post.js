const router = require('express').Router();
const pool = require('../dbconfig');
const Authorize = require('../middleware/Authorize');
const postController = require('../controller/postController');


router.get('/:id',postController.getPostById);

router.use(Authorize);

router.get('/',postController.getPostByEmail);

router.put("/:id",postController.updatePost);

router.delete(':id',postController.deletePost);


module.exports = router;