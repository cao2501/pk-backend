const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const controller = require('../controllers/admin.controller');
const productController = require('../controllers/product.controller');

// Admin middleware - only admin can access these routes
const adminAuth = auth('admin');

// Dashboard
router.get('/dashboard', adminAuth, controller.getDashboardStats);

// Products management
router.get('/products', adminAuth, controller.getProducts);
router.post('/products', adminAuth, upload.array('images', 5), handleUploadError, productController.createValidators, productController.create);
router.put('/products/:id', adminAuth, upload.array('images', 5), handleUploadError, productController.createValidators, productController.update);
router.delete('/products/:id', adminAuth, productController.remove);

// Orders management
router.get('/orders', adminAuth, controller.getOrders);
router.put('/orders/:id/status', adminAuth, controller.updateOrderStatus);

// Customers management
router.get('/customers', adminAuth, controller.getCustomers);
router.get('/customers/:id', adminAuth, controller.getCustomerDetails);

module.exports = router;
