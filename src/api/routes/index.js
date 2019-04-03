const express = require('express');

const authRoutes = require('./auth.route');
const spreadRoutes = require('./spread.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/spreads', spreadRoutes);

module.exports = router;