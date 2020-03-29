"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk");

const encryptUserCredentials = require("./utils/encryptUserCredentials");
const errorResponse = require("./utils/errorResponse");

const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context, callback) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { firstName, lastName, username, credentials, email } = requestBody;

    if (!firstName || !lastName || !username || !credentials || !email) {
      throw new Error("Invalid user input");
    }

    const { CiphertextBlob } = await encryptUserCredentials(credentials);

    const id = uuid.v4();
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id,
        firstName,
        lastName,
        username,
        credentials: CiphertextBlob,
        email
      }
    };

    await ddb.put(params).promise();

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*" // Required for CORS support to work
      },
      body: JSON.stringify({
        message: "User was created!"
      })
    };

    callback(null, response);
  } catch (err) {
    errorResponse(err.message, context.awsRequestId, callback);
  }
};
