process.env.TABLE_NAME = "Users";

const AWS = require("aws-sdk-mock");

const MOCK_BODY = {
  firstName: "John",
  lastName: "Smith",
  username: "jon01",
  credentials: "pass",
  email: "john@email.com"
};

jest.mock("./utils/encryptUserCredentials", () =>
  jest.fn(credentials => {
    if (credentials === "invalid") {
      throw new Error("Invalid creds");
    }

    return { CiphertextBlob: "foo" };
  })
);
jest.mock("uuid", () => ({
  v4: jest.fn(() => "uuid")
}));

describe("createUser", () => {
  afterEach(() => {
    AWS.restore("DynamoDB.DocumentClient");
  });

  test("should save user to DB", async () => {
    AWS.mock("DynamoDB.DocumentClient", "put", () => Promise.resolve({}));

    const createUser = require("./createUser");

    const context = { awsRequestId: "test1" };
    const callback = jest.fn();
    const event = {
      body: JSON.stringify(MOCK_BODY)
    };

    await createUser.handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*" // Required for CORS support to work
      },
      body: JSON.stringify({
        message: "User was created!"
      })
    });
  });

  test("should throw error if no firstName", async () => {
    AWS.mock("DynamoDB.DocumentClient", "put", () => Promise.resolve({}));
    const createUser = require("./createUser");

    const context = { awsRequestId: "test2" };
    const callback = jest.fn();

    const event = {
      body: JSON.stringify({ ...MOCK_BODY, firstName: void 0 })
    };

    await createUser.handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      body: JSON.stringify({
        Error: "Invalid user input",
        Reference: "test2"
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  });

  test("should throw error if no lastName", async () => {
    AWS.mock("DynamoDB.DocumentClient", "put", () => Promise.resolve({}));
    const createUser = require("./createUser");

    const context = { awsRequestId: "test3" };
    const callback = jest.fn();

    const event = {
      body: JSON.stringify({ ...MOCK_BODY, lastName: void 0 })
    };

    await createUser.handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      body: JSON.stringify({
        Error: "Invalid user input",
        Reference: "test3"
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  });

  test("should throw error if no userName", async () => {
    AWS.mock("DynamoDB.DocumentClient", "put", () => Promise.resolve({}));
    const createUser = require("./createUser");

    const context = { awsRequestId: "test4" };
    const callback = jest.fn();

    const event = {
      body: JSON.stringify({ ...MOCK_BODY, username: void 0 })
    };

    await createUser.handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      body: JSON.stringify({
        Error: "Invalid user input",
        Reference: "test4"
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  });

  test("should throw error if no credentials", async () => {
    AWS.mock("DynamoDB.DocumentClient", "put", () => Promise.resolve({}));
    const createUser = require("./createUser");

    const context = { awsRequestId: "test2" };
    const callback = jest.fn();

    const event = {
      body: JSON.stringify({ ...MOCK_BODY, credentials: void 0 })
    };

    await createUser.handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      body: JSON.stringify({
        Error: "Invalid user input",
        Reference: "test2"
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  });

  test("should throw error if no email", async () => {
    AWS.mock("DynamoDB.DocumentClient", "put", () => Promise.resolve({}));
    const createUser = require("./createUser");

    const context = { awsRequestId: "test5" };
    const callback = jest.fn();

    const event = {
      body: JSON.stringify({ ...MOCK_BODY, lastName: void 0 })
    };

    await createUser.handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      body: JSON.stringify({
        Error: "Invalid user input",
        Reference: "test5"
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  });

  test("should handle error if encryptUserCredentials fails", async () => {
    AWS.mock("DynamoDB.DocumentClient", "put", () => Promise.resolve({}));
    const createUser = require("./createUser");

    const context = { awsRequestId: "test6" };
    const callback = jest.fn();

    const event = {
      body: JSON.stringify({ ...MOCK_BODY, credentials: "invalid" })
    };

    await createUser.handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      body: JSON.stringify({
        Error: "Invalid creds",
        Reference: "test6"
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  });

  test("should handle error for DB put", async () => {
    AWS.mock("DynamoDB.DocumentClient", "put", () =>
      Promise.reject(new Error("Missing region in config"))
    );
    const createUser = require("./createUser");

    const context = { awsRequestId: "test7" };
    const callback = jest.fn();

    const event = {
      body: JSON.stringify(MOCK_BODY)
    };

    await createUser.handler(event, context, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      body: JSON.stringify({
        Error: "Missing region in config",
        Reference: "test7"
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  });
});
