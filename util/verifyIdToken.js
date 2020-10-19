var admin = require("firebase-admin");
const { resolve } = require("path");
const serviceAccount = resolve("secrets", "service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://m3ntorship-pickly.firebaseio.com",
});

const verifyIdToken = (idToken) => admin.auth().verifyIdToken(idToken);
module.exports.verifyIdToken = verifyIdToken;
