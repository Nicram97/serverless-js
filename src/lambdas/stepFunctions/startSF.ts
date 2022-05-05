import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const { machineName } = JSON.parse(event.body);
    const stepFunctions = getStepFunctionsClient();
    const stateMachineArn =
      process.env[`OFFLINE_STEP_FUNCTIONS_ARN_${machineName}`];

    const params: AWS.StepFunctions.StartExecutionInput = {
      stateMachineArn,
    };

    const result: AWS.StepFunctions.StartExecutionOutput = await stepFunctions
      .startExecution(params)
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error(err.message);
  }
};

const getStepFunctionsClient = (): AWS.StepFunctions => {
  if (process.env.IS_OFFLINE) {
    return new AWS.StepFunctions({ endpoint: 'http://localhost:8083' });
  }
  return new AWS.StepFunctions();
};
