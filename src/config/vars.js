require('dotenv').config();
module.exports = {
  port: process.env.PORT,
  mongo: {
    uri:
      process.env.NODE_ENV === 'development'
        ? process.env.MONGO_URL
        : process.env.MONGO_URL_TESTS,
  },
};
