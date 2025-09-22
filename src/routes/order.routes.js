const router = require('express').Router();
const { auth } = require('../middleware/auth');
const controller = require('../controllers/order.controller');

router.post('/', controller.createValidators, controller.create);
router.get('/', auth('admin'), controller.list);
router.get('/my', auth(), controller.myOrders);
router.get('/:id', auth('admin'), controller.getById);
router.put('/:id/status', auth('admin'), controller.updateStatus);

module.exports = router;


