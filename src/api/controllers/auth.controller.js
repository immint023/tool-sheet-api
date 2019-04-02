const httpStatus = require('http-status');
const brcypt = require('bcrypt');

const User = require('../models/user.model');

const saltRounds = 10;

module.exports.register = async (req, res, next) => {
  try {
    const hashedPassword = await brcypt.hash(req.body.password, saltRounds);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    delete user._doc.password;
    
    const { tokenType, accessToken } = await User.findAndGenerateToken(req.body);
    return res.status(httpStatus.CREATED).json({
      token: {
        tokenType,
        accessToken,
      },
      user: user._doc,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { tokenType, accessToken, user } = await User.findAndGenerateToken(
      req.body
    );
    return res.status(httpStatus.OK).json({
      token: {
        tokenType,
        accessToken,
      },
      user,
    });
  } catch (error) {
    return next(error);
  }
};
