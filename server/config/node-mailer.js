var nodemailer = require("nodemailer");
const { webClientID } = require("./auth-tokens");
let emailCodebrink = "";

var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    type: "OAuth2",
    user: emailCodebrink,
    clientId: webClientID,
    clientSecret: "",
    accessToken: "",
    refreshToken: ""
  }
});

module.exports = { transporter, emailCodebrink };
