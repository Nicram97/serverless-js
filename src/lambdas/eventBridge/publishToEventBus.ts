import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as AWS from 'aws-sdk';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const {eventBusName, source, detailType, detail} = JSON.parse(event.body);
    const eventBridgeClient = getEventBridgeClient();

    eventBridgeClient.putEvents({
        Entries: [
            {
                EventBusName: eventBusName,
                Source: source,
                DetailType: detailType,
                Detail: detail
            },
        ],
    }).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({status: 'successful'}),
    };
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