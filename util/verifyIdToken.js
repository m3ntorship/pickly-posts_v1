var admin = require("firebase-admin");
var serviceAccount = require("../secrets/service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://m3ntorship-pickly.firebaseio.com",
});

const verifyIdToken = (idToken) => admin.auth().verifyIdToken(idToken);
module.exports.verifyIdToken = verifyIdToken