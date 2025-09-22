const router = require('express').Router();
const { auth } = require('../middleware/auth');
const controller = require('../controllers/cart.controller');

router.get('/', auth(), controller.getMyCart);
router.post('/', auth(), controller.upsertValidators, controller.addOrUpdateItem);
router.delete('/:productId', auth(), controller.removeItem);

module.exports = router;


