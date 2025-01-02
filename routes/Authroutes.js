const express = require('express');
const router = express.Router();
const authRoutes=require('../controllers/AuthController');
router.post('/signup',authRoutes.SignUp);
router.post('/login',authRoutes.Login);

module.exports = router;
