const router = require('express').Router();

const controller = require('../controller/leilaoController');


router.get('/', controller.list);
//router.get('/:id', controller.listOne);
router.get('/empresa/:idEmpresa', controller.listEmpresa);

module.exports = router;