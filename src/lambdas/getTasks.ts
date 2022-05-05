import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { TaskService } from '../services/TaskService';

export const handler: APIGatewayProxyHandler = async (
  _event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const taskService = new TaskService();
  const tasks = await taskService.getAllTasks();

  return {
    statusCode: 201,
    body: JSON.stringify({
      items: tasks,
    }),
  };
};
