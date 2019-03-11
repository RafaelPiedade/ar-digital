const router = require('express').Router();

const controller = require('../controller/principalController');


router.get('/', controller.home);
router.get('/pdf', controller.pdf)
router.post('/allpdf',controller.allpdf)
router.get('/ar', controller.edit)
module.exports = router;