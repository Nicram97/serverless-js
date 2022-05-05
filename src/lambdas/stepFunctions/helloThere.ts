import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (
  _event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const response = {
      statusCode: 200,
      body: 'Hello there!',
    };
    return response;
  } catch (err) {
    throw new Error(err.message);
  }
};
