import { APIGatewayProxyEvent } from "aws-lambda";
import * as AWS from 'aws-sdk';

export const handler = async (event: APIGatewayProxyEvent): Promise<any> => {
    try {
        console.log('EVENT', event);
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
        }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: sendEmail.MessageId || 'siema'
            }),
        };
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