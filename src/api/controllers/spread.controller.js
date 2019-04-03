const httpStatus = require('http-status');
const { google } = require('googleapis');

const { getData, getNewTokenAndData } = require('../services/google');
const { importData } = require('../../tools/import-data-sheet');

const Spread = require('../models/spread-sheet.model');
const English = require('../models/english.model');
const Translate = require('../models/translate.model');
const User = require('../models/user.model');

module.exports.create = async (req, res, next) => {
  const {
    user,
    body: { url, alias },
  } = req;
  const reg = new RegExp(/[\w-]{14,}/g);
  const [sheetID] = url.match(reg);
  try {
    const sender = await User.findById(user)
      .select('googleToken')
      .lean();

    const { isSuccess, verifyUrl, auth } = getData(sender.googleToken, url);
    if (!isSuccess) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Vui lòng xác thực quyền truy cập.',
        verifyUrl,
      });
    }
    const sheets = google.sheets({ version: 'v4', auth });
    const { data } = await sheets.spreadsheets.get({
      spreadsheetId: sheetID,
    });

    const spread = await importData(data, sheets, req);
    return res.status(httpStatus.OK).json({
      isSuccess: true,
      data: spread,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports.getToken = async (req, res, next) => {
  const {
    user,
    body: { code },
  } = req;
  try {
    const { token, isSuccess } = await getNewTokenAndData(code);
    if (!isSuccess) {
      return next(new Error('Đã xảy ra sự cố!'));
    }
    await User.findByIdAndUpdate(user._id, {
      googleToken: token,
    });
    return res.status(httpStatus.OK).json({
      isSuccess,
    });
  } catch (error) {
    return next(error);
  }
};
