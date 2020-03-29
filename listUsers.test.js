process.env.TABLE_NAME = "Users";

const AWS = require("aws-sdk-mock");

describe("listUsers", () => {
  afterEach(() => {
    AWS.restore("DynamoDB.DocumentClient");
  });

  test("should retrieve users", async () => {
    AWS.mock("DynamoDB.DocumentClient", "scan", () =>
      Promise.resolve([{ firstName: "John" }])
    );
    const listUsers = require("./listUsers");

    const context = { awsRequestId: "test1" };
    const callback = jest.fn();

    await listUsers.handler(null, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*" // Required for CORS support to work
      },
      body: JSON.stringify({
        message: "Success!",
        data: [{ firstName: "John" }]
      })
    });
  });

  test("should handle error", async () => {
    AWS.mock("DynamoDB.DocumentClient", "scan", () =>
      Promise.reject(new Error("Missing region in config"))
    );

    const listUsers = require("./listUsers");

    const context = { awsRequestId: "test2" };
    const callback = jest.fn();

    await listUsers.handler(null, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      body: JSON.stringify({
        Error: "Missing region in config",
        Reference: context.awsRequestId
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  });
});
