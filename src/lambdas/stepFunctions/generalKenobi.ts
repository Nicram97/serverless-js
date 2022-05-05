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
      body: 'General Kenobi, I ve been expecting You!',
    };
    return response;
  } catch (err) {
    throw new Error(err.message);
  }
};
