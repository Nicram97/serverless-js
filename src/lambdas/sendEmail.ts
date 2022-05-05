import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  SNSEvent,
  SNSEventRecord,
} from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { SendEmailResponse } from 'aws-sdk/clients/ses';

const isGateway = (
  event: APIGatewayProxyEvent | SNSEvent,
): event is APIGatewayProxyEvent => {
  return (event as APIGatewayProxyEvent).body !== undefined;
};
/**
 * Function to send email by HTTP or reacting to SNS event it is in one function on purpose to train type guard
 * @param event
 * @returns
 */
export const handler = async (
  event: APIGatewayProxyEvent | SNSEvent,
): Promise<APIGatewayProxyResult | SendEmailResponse> => {
  try {
    let emailResult: APIGatewayProxyResult | SendEmailResponse;

    if (isGateway(event)) {
      const a = await sendEmail(event.body);
      emailResult = {
        statusCode: 200,
        body: JSON.stringify(a),
      };
    } else {
      const records: SNSEventRecord[] = event.Records;
      for await (const record of records) {
        const messageBody = record.Sns.Message;
        console.log('Message is: ', messageBody);
        const b = await sendEmail(messageBody);
        emailResult = {
          MessageId: b.MessageId,
        };
      }
    }
    return emailResult;
  } catch (e) {
    throw new Error(`Cant send email, ${e.message}`);
  }
};

const getClient = (): AWS.SESV2 => {
  if (process.env.IS_OFFLINE) {
    return new AWS.SESV2({ endpoint: 'http://localhost:8064' });
  }
  return new AWS.SESV2();
};

const sendEmail = async (body: any) => {
  const { text, subject, fromAddress, toAddresses } = JSON.parse(body);
  const client = getClient();

  const emailResponse = await client
    .sendEmail({
      Content: {
        Simple: {
          Body: { Text: { Data: text } },
          Subject: { Data: subject },
        },
      },
      Destination: { ToAddresses: toAddresses },
      FromEmailAddress: fromAddress,
      ConfigurationSetName: 'default',
    })
    .promise();

  return emailResponse;
};
