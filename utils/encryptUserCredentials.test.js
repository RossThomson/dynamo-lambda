const AWS = require("aws-sdk-mock");

AWS.mock("KMS", "encrypt", () => Promise.resolve({ CiphertextBlob: "foo" }));

process.env.KMS_KEY = "foo";

const encryptUserCredentials = require("./encryptUserCredentials");

describe("utils/encryptUserCredentials", () => {
  test("should encrypt user credentials", async () => {
    const result = await encryptUserCredentials("credentials");

    expect(result).toEqual({ CiphertextBlob: "foo" });
  });

  afterAll(() => AWS.restore("KMS"));
});
