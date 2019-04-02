const mongoose = require('mongoose');

const spreadSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    alias: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Spread', spreadSchema, 'spreads');
