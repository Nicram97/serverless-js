import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from 'aws-sdk';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { eventBusName, source, detailType, detail } = JSON.parse(event.body);
        const eventBridgeClient = getEventBridgeClient();

        const result = await eventBridgeClient.putEvents({
            Entries: [
                {
                    EventBusName: eventBusName,
                    Source: source,
                    DetailType: detailType,
                    Detail: JSON.stringify(detail)
                },
            ],
        }).promise();

        console.log(result);
        return {
            statusCode: 200,
            body: JSON.stringify({ status: 'successful' }),
        };
    } catch (err) {
        console.error(err);
    }
}

const getEventBridgeClient = (): AWS.EventBridge => {
    if (process.env.IS_OFFLINE) {
        return new AWS.EventBridge({
            endpoint: 'http://127.0.0.1:4010',
            accessKeyId: "YOURKEY",
            secretAccessKey: "YOURSECRET",
            region: "eu-west-1"
        });
    }
    return new AWS.EventBridge();
};