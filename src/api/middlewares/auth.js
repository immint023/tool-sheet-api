const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const User = require('../models/user.model');

module.exports.authorize = role => async (req, res, next) => {
  const { token } = req.query || req.headers || req.body;
  if (!token) {
    return next(new Error('Not found authentication'));
  }
  const tokens = token.split('Bearer ');
  if (tokens.length !== 2 || tokens[0] !== '') {
    return next(new Error('Not authentication format!'));
  }
  const authToken = tokens[1];
  try {
    const payload = await jwt.verify(authToken, process.env.KEY_JWT);
    const user = await User.findById(payload._id)
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
