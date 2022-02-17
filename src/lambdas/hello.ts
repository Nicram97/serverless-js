import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const response = {
      statusCode: 200,
      body: 'Hello world',
    };
    return response;
  } catch (err) {
    return {
      statusCode: 500,
      body: 'An error occurred',
    };
  }
};