const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { jwt_secret } = require('../../config/vars');

const roles = ['user', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: String,
    avatar: String,
    email: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: roles,
    },
    password: String,
    googleToken: {
      access_token: String,
      refresh_token: String,
      scope: String,
      token_type: String,
      expiry_date: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics = {
  async findAndGenerateToken({ email, password }) {
    if (!email) {
      throw new Error({
        message: 'An email is required to generate a token!',
      });
    }
    if (!password) {
      throw new Error({
        message: 'A password is required to generate a token!',
      });
    }
    try {
      const user = await this.findOne({ email }).lean();
      if (!user) {
        throw new Error({
          message: 'Email or password is not correct!',
        });
      }
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        throw new Error('Email or password is not correct!');
      }
      delete user.password;
      const token = jwt.sign(
        {
          data: user,
        },
        jwt_secret,
        { expiresIn: '1h' }
      );
      return { tokenType: 'Bearer', accessToken: token, user };
    } catch (error) {
      throw new Error(error);
    }
  },
};

userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    return next(new Error('This email has already registed!'));
  }

  return next(error);
});

module.exports = mongoose.model('User', userSchema, 'users');
