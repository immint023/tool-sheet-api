const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const { authorize } = require('../middlewares/auth');

router.post('/register', authorize('admin'), controller.register);
router.post('/login', controller.login);

module.exports = router;
