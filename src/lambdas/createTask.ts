import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Task } from "../interfaces/task";
import { TaskService } from "../services/TaskService";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { name } = JSON.parse(event.body)

    const taskService = new TaskService()
    const task: Task = await taskService.createTask(name)

    return {
        statusCode: 201,
        body: JSON.stringify({
            item: task
        })
    };
}