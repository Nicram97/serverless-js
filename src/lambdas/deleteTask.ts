import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { TaskService } from "src/services/TaskService"

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id

    const taskService = new TaskService();
    await taskService.deleteTaskById(id);

    return {
        statusCode: 200,
        body: 'hello'
    }
}