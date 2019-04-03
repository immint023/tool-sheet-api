const { google } = require('googleapis');

const mongoose = require('../config/mongoose');

const English = require('../api/models/english.model');
const Translate = require('../api/models/translate.model');
const Spread = require('../api/models/spread-sheet.model');
const Sheet = require('../api/models/sheet.model');

mongoose.connect();

module.exports.importData = async (
  data,
  api,
  { user, body: { url, alias } }
) => {
  try {
    const spread = await Spread.create({
      title: data.properties.title,
      author: user,
      sheets: [],
      url,
      alias,
    });

    const promises = [];

    for (let sheet of data.sheets) {
      const sheetDb = new Sheet({
        title: sheet.properties.title,
        spread: spread._id,
      });
      spread.sheets.push(sheetDb._id);
      promises.push(sheetDb);
      const res = await api.spreadsheets.values.get({
        spreadsheetId: data.spreadsheetId,
        range: `${sheet.properties.title}`,
      });
      const rows = res.data.values;

      for (let i = 1; i < rows.length; i++) {
        const english = new English({
          text: rows[i][0],
          sheet: sheetDb._id,
        });
        promises.push(english);
        for (let j = 1; j < rows[i].length; j++) {
          const translate = new Translate({
            code: rows[0][j],
            text: rows[i][j],
            english: english._id,
            sheet: sheetDb._id,
          });
          promises.push(translate);
        }
      }
    }
    await Promise.all(promises.map(item => item.save()));
    return spread;
  } catch (error) {
    throw new Error(error.message);
  }
};
