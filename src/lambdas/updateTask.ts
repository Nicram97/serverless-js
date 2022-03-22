import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { Task } from "../interfaces/task";
import { TaskService } from "../services/TaskService"

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
  
    const taskService = new TaskService();
    const task: Partial<Task> = { ...JSON.parse(event.body), id }
  
    const taskUpdated = await taskService.updateTask(task);
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: taskUpdated
      })
    }
  }