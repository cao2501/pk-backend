const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const controller = require('../controllers/product.controller');

router.get('/', controller.listValidators, controller.list);
router.get('/:id', controller.getById);

// Upload middleware cho create và update
const uploadMiddleware = upload.array('images', 5); // Tối đa 5 ảnh

router.post('/', auth('admin'), uploadMiddleware, handleUploadError, controller.createValidators, controller.create);
router.put('/:id', auth('admin'), uploadMiddleware, handleUploadError, controller.createValidators, controller.update);
router.delete('/:id', auth('admin'), controller.remove);

module.exports = router;


