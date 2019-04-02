const mongoose = require('mongoose');

const englishSchema = new mongoose.Schema(
  {
    text: String,
    spread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Spread',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('English', englishSchema, 'english');
