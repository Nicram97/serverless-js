import { APIGatewayProxyEvent, APIGatewayProxyResult, SNSEvent, SNSEventRecord, SNSHandler } from "aws-lambda";
import * as AWS from 'aws-sdk';

const isGateway = (event: APIGatewayProxyEvent | SNSEvent): event is APIGatewayProxyEvent => {
    return (event as APIGatewayProxyEvent).body !== undefined;
}
export const handler = async (event: APIGatewayProxyEvent | SNSEvent): Promise<APIGatewayProxyResult | SNSHandler> => {
    try {
        if (isGateway(event)) {
            const { text, subject, fromAddress, toAddresses } = JSON.parse(event.body);
            const client = getClient();
            const sendEmail = await client.sendEmail({
                Content: {
                    Simple: {
                        Body: { Text: { Data: text } },
                        Subject: { Data: subject }
                    }
                },
                Destination: { ToAddresses: toAddresses },
                FromEmailAddress: fromAddress,
                ConfigurationSetName: 'default'
            }).promise();
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: sendEmail.MessageId || 'message dont have assigned id, possible error'
                }),
            };
        } else {
            const records: SNSEventRecord[] = event.Records;
            records.forEach(record => {
                console.log('Message is: ', record.Sns.Message);
            });
        }
    } catch (e) {
        throw new Error(`Cant send email, ${e.message}`);
    }
}

const getClient = (): AWS.SESV2 => {
    if (process.env.IS_OFFLINE) {
        return new AWS.SESV2({ endpoint: "http://localhost:8005" });
    }
    return new AWS.SESV2();
}