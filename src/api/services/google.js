const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const credentials = require('../../constants/credentials.json');

const { client_secret, client_id, redirect_uris } = credentials.installed;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

module.exports.getData = (google_token, url) => {
  if (!google_token) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'online',
      scope: SCOPES,
    });
    return {
      isSuccess: false,
      verifyUrl: authUrl,
    };
  }
  oAuth2Client.setCredentials(google_token);
  return {
    auth: oAuth2Client,
    isSuccess: true,
  };
};

module.exports.getNewTokenAndData = async code => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    return {
      isSuccess: true,
      token: tokens,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
    };
  }
};
