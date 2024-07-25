/* eslint-disable linebreak-style */
const {google} = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");
const CLIENT_ID = "446658067529-nnc8agu8ndvvmc2olckt45std5ehjhh0.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04eR8JmNk0JNkCgYIARAAGAQSNwF-L9IrJiTo8YbkLpO4iPu_TaT0sakbptVTLozc_UyjzzeS0mWUyYX01PgOf7fS0a4m0r9lFkU';
const getGmailService = function() {
  const oAuth2Client = new google.auth.OAuth2(
      // eslint-disable-next-line max-len
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI,
      REFRESH_TOKEN
  );
  // eslint-disable-next-line max-len
  const accessToken = oAuth2Client.getAccessToken();
  oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});
  // const gmail = google.gmail({version: 'v1', auth: oAuth2Client});
  const gmail = google.gmail({
    version: 'v1',
    auth: {
      type: 'OAuth2',
      user: 'ni.catalmir@gmail.com',
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
  return gmail;
};

const encodeMessage = function(message) {
  return Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "-")
      .replace(/=+$/, "");
};

const createMail = async function(options) {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const sendMail = async function(options) {
  const gmail = getGmailService();
  const rawMessage = await createMail(options);
  const {data: {id}} = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: rawMessage,
    },
  });
  return id;
};
module.exports = sendMail;
