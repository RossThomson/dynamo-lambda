const AWS = require("aws-sdk");

const errorResponse = require("./utils/errorResponse");

const ddb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context, callback) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    ProjectionExpression: "firstName, lastName, username, email"
  };
  const data = await ddb
    .scan(params)
    .promise()
    .catch(err => errorResponse(err.message, context.awsRequestId, callback));

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*" // Required for CORS support to work
    },
    body: JSON.stringify({
      message: "Success!",
      data
    })
  };

  callback(null, response);
};
