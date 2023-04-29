const server_keys = require("../config/server-keys");
var api_access_key_user = server_keys.api_access_key_user;

module.exports.getAndroidAppData = (req, res) => {
  var key = req.header("api_access_key_user");
  if (key != api_access_key_user)
    return res.status(400).send("Not a valid user access API key.");

  return res.send({
    versionCode: 1,
    whatsNew: "Continued Improvements!",
    forcedUpdate: false
  });
};
