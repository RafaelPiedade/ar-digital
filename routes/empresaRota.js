const router = require('express').Router();

const controller = require('../controller/empresaController');


router.get('/', controller.list);


module.exports = router;