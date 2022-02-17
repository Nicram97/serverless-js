import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const parsedBody = JSON.parse(event.body || '');
    return {
      statusCode: 200,
      body: `Goodbye ${parsedBody?.name}`,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'An error occurred',
    };
  }
};