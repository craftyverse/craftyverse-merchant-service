import {
  PublishCommand,
  SNSClient,
  SNSClientConfig,
} from "@aws-sdk/client-sns";
import { BadRequestError } from "@craftyverse-au/craftyverse-common";

export class SnsService {
  private static snsClient: SNSClient;

  /**
   * This function will generate a default AWS SNS client
   * @returns {SNSClient}
   */
  static createSnsClient(snsClient: SNSClient): SNSClient {
    if (!this.snsClient) {
      this.snsClient = snsClient;
    }

    return this.snsClient;
  }

  static async publishSnsMessage(
    snsConfig: SNSClientConfig,
    params: {
      message: string;
      subject: string;
      topicArn: string;
    }
  ) {
    const snsClient = this.createSnsClient(new SNSClient(snsConfig));

    const publishSnsMessageParams = {
      Message: params.message,
      Subject: params.subject,
      TopicArn: params.topicArn,
    };

    const publishSnsMessageCommand = new PublishCommand(
      publishSnsMessageParams
    );

    const publishSnsMessageResponse = await snsClient.send(
      publishSnsMessageCommand
    );

    if (publishSnsMessageResponse.$metadata.httpStatusCode !== 200) {
      throw new BadRequestError("Failed to publish message");
    }

    return publishSnsMessageResponse;
  }
}
