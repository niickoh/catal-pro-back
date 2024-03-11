/* eslint-disable linebreak-style */
const {google} = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");

const getGmailService = function() {
  const oAuth2Client = new google.auth.OAuth2(
      // eslint-disable-next-line max-len
      "446658067529-nnc8agu8ndvvmc2olckt45std5ehjhh0.apps.googleusercontent.com",
      "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",
      "https://developers.google.com/oauthplayground",
  );
  // eslint-disable-next-line max-len
  oAuth2Client.setCredentials({refresh_token: "1//040hJUq41ogMNCgYIARAAGAQSNwF-L9Irv513UgSglhhd6i4khgdrFih1aIALdNLFefxyTrJh02XKjyfhgyfu9ysv0NrgwxBsgi4"});
  const gmail = google.gmail({version: "v1", auth: oAuth2Client});
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
