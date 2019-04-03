const mongoose = require('mongoose');

const translateSchema = new mongoose.Schema(
  {
    text: String,
    code: String,
    english: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'English',
    },
    sheet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sheet',
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Translate', translateSchema, 'translates');