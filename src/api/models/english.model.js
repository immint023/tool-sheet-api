const mongoose = require('mongoose');

const englishSchema = new mongoose.Schema(
  {
    text: String,
    sheet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sheet',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('English', englishSchema, 'english');
