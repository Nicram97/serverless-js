import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from 'aws-sdk';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const sns = getSnsClient();
        const { region, accountId, topicName, message } = JSON.parse(event.body);
        const id = accountId ? accountId : '123456789012';
        const arn = `arn:aws:sns:${region}:${id}:${topicName}`;
        const message1 = JSON.stringify({
            "default": JSON.stringify(message),
            "email": "A message for email.",
            "email-json": "A message for email (JSON).",
            "http": "A message for HTTP.",
            "https": "A message for HTTPS.",
            "sqs": "A message for Amazon SQS."
        });
        sns.publish({
            Message: message1,
            MessageStructure: 'json',
            TopicArn: arn,
        }, (err, data) => {
            console.log('test', err, data)
        });
        return {
            statusCode: 200,
            body: 'Request to sns has been sent'
        }
    } catch (e) {
        throw new Error(`Cant send message to Sns ${e.message}`);
    }
}

const getSnsClient = (): AWS.SNS => {
    if (process.env.IS_OFFLINE) {
        return new AWS.SNS({ endpoint: "http://localhost:4002" });
    }
    return new AWS.SNS();
}