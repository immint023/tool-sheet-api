const mongoose = require('mongoose');

const sheetSchema = new mongoose.Schema(
  {
    title: String,
    spread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Spread',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Sheet', sheetSchema, 'sheets');
