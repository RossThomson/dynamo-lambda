const errorResponse = require("./errorResponse");

describe("utils/errorResponse", () => {
  test("should return error response", () => {
    const callback = jest.fn();
    const errorMessage = "There was an error";
    const awsRequestId = "foo";

    errorResponse(errorMessage, awsRequestId, callback);

    expect(callback).toBeCalledWith(null, {
      statusCode: 500,
      body: JSON.stringify({
        Error: errorMessage,
        Reference: awsRequestId
      }),
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  });
});
