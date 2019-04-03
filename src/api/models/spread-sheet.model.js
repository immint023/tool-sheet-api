const mongoose = require('mongoose');

const spreadSchema = new mongoose.Schema(
  {
    title: String,
    alias: String,
    url: {
      type: String,
      unique: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sheets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sheet',
      },
    ],
  },
  {
    timestamps: true,
  },
);

spreadSchema.post('save', function(error, docs, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    return next(new Error('This sheet was added!'));
  }
});

module.exports = mongoose.model('Spread', spreadSchema, 'spreads');
