const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
// const captchaController = require('../controllers/captcha.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/getdata', verifyToken, authController.getData);
router.get('/create-captcha', authController.captcha);
// router.post('/verify-captcha', authController.verifyCaptcha);

module.exports = router;