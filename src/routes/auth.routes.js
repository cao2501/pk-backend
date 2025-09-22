const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { login, loginValidators, register, registerValidators, me } = require('../controllers/auth.controller');

router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);
router.get('/me', auth(), me);

module.exports = router;


