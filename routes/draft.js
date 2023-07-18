const router = require('express').Router();
const Authorize = require('../middleware/Authorize');
const draftController = require('../controller/draftController');

router.use(Authorize);


router.post('/create',draftController.createDraft);

router.get('/publish/:id',draftController.publishDraft);

router.put('/:id',draftController.updateDraft);


module.exports = router;