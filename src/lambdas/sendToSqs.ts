import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from 'aws-sdk';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const sqs = getSqsClient();
        const {
            // Remove DelaySeconds parameter and value for FIFO queues
            DelaySeconds,
            MessageAttributes,
            MessageBody,
            // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
            // MessageGroupId: "Group1",  // Required for FIFO queues
            QueueUrl
        } = JSON.parse(event.body);

        const result = await sqs.sendMessage({
            DelaySeconds,
            MessageAttributes,
            MessageBody,
            QueueUrl
        }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        }

    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify(e.message)
        }
    }
}

const getSqsClient = (): AWS.SQS => {
    if (process.env.IS_OFFLINE) {
        return new AWS.SQS({ apiVersion: '2012-11-05', endpoint: 'http://localhost:9324' });
    }
    return new AWS.SQS({ apiVersion: '2012-11-05' });
}