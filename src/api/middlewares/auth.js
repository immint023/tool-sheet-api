const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const User = require('../models/user.model');
const { jwt_secret } = require('../../config/vars');

module.exports.authorize = role => async (req, res, next) => {
  const token = req.query.token || req.headers.token || req.body.token;
  if (!token) {
    return next(new Error('Not found authentication'));
  }
  const tokens = token.split('Bearer ');
  if (tokens.length !== 2 || tokens[0] !== '') {
    return next(new Error('Not authentication format!'));
  }
  const authToken = tokens[1];
  try {
    const { data } = await jwt.verify(authToken, jwt_secret);
    const user = await User.findById(data._id)
      .select('name avatar role email googleToken')
      .lean();
    if (!user) {
      return next({
        code: httpStatus.NOT_FOUND,
        message: 'User not found!',
      });
    }
    if (role === 'admin' && user.role !== 'admin') {
      return next({
        code: httpStatus.FORBIDDEN,
        message: 'FORBIDEN',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return next(error);
  }
};
