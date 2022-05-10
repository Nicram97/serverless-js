import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    console.log('event', event);
    const response = {
      statusCode: 200,
      body: 'Hello there!',
    };
    return response;
  } catch (err) {
    throw new Error(err.message);
  }
};
