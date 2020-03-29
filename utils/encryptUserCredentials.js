const AWS = require("aws-sdk");

const kms = new AWS.KMS();

function encryptUserCredentials(credentials) {
  const params = {
    KeyId: process.env.KMS_KEY,
    Plaintext: credentials
  };

  return kms.encrypt(params).promise();
}

module.exports = encryptUserCredentials;
