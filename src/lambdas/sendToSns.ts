import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const sns = getSnsClient();
    const { region, accountId, topicName, message } = JSON.parse(event.body);
    const id = accountId ? accountId : '123456789012';
    const arn = `arn:aws:sns:${region}:${id}:${topicName}`;

    // If you want to send email message should have structure like below and contain default property
    const snsMessage = JSON.stringify({
      default: JSON.stringify(message),
    });

    const result = await sns
      .publish({
        Message: snsMessage,
        MessageStructure: 'json',
        TopicArn: arn,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (e) {
    throw new Error(`Cant send message to Sns ${e.message}`);
  }
};

const getSnsClient = (): AWS.SNS => {
  if (process.env.IS_OFFLINE) {
    return new AWS.SNS({ endpoint: 'http://localhost:4002' });
  }
  return new AWS.SNS();
};
