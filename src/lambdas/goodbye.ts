import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('test', event);
    const parsedBody = JSON.parse(event.body || '');
    return {
      statusCode: 200,
      body: `Goodbye ${parsedBody?.name}`,
    };
  } catch (err) {
    throw new Error(`Error in goodbye, ${err.message}`);
  }
};