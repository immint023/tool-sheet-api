const express = require('express');

const controller = require('../controllers/spread.controller');
const { authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(authorize(), controller.getList)
  .post(authorize(), controller.create);
  
router.route('/token').post(authorize(), controller.getToken);

module.exports = router;
