import { SNSClient } from "@aws-sdk/client-sns";
import { SnsService } from "./sns-service";
import { credentials } from "../middleware/credentials";
import { en } from "@faker-js/faker";
describe("SnsService", () => {
  console.log(process.env.AWS_REGION!);
  console.log(process.env.AWS_ACCESS_KEY_ID!);
  console.log(process.env.AWS_SECRET_ACCESS_KEY!);
  console.log(process.env.AWS_ENDPOINT!);
  const snsClientConfig = {
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.AWS_ENDPOINT!,
  };
  describe("createSnsClient", () => {
    it("should create a default AWS SNS client", () => {
      const snsClient = new SNSClient(snsClientConfig);
      const createdSnsClient = SnsService.createSnsClient(snsClient);
      expect(createdSnsClient).toBe(snsClient);
    });
  });

  describe("publishSnsMessage", () => {
    it("should publish a message to an SNS topic", async () => {
      const snsClient = new SNSClient(snsClientConfig);
      const message = "Hello, World!";
      const subject = "Test";
      const topicArn = process.env.MERCHANT_CREATED_SNS_TOPIC_ARN!;
      const response = await SnsService.publishSnsMessage(snsClient, {
        message,
        subject,
        topicArn,
      });

      expect(response).toBeDefined();
      expect(response.MessageId).toBeDefined();
    });
  });
});
