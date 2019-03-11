const router = require('express').Router();

const controller = require('../controller/loteController');


router.get('/', controller.list);
router.get('/proprietario', controller.listProprietario)
router.get('/comunicacao1', controller.listComunicacao1)
router.get('/comunicacao2', controller.listComunicacao2)

module.exports = router;