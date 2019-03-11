const router = require('express').Router();

const controller = require('../controller/dataController');

router.get('/', controller.home);
router.get('/teste', controller.data);


module.exports = router;