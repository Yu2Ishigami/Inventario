const { Router } = require('express');
const controller = require('../controllers/products.controller');

const router = Router();

router.get('/', controller.list);
router.get('/stats', controller.stats);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id/stock', controller.adjustStock);
router.delete('/:id', controller.remove);

module.exports = router;
