import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Task } from 'src/interfaces/task'

export class TaskRepository {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly taskTable = process.env.TASKS_TABLE
    ) {

    }

    async getAllTasks(): Promise<Task[]> {
        const result = await this.docClient.scan({
            TableName: this.taskTable
        }).promise()

        return result.Items as Task[];
    }

    async createTask(task: Task): Promise<Task> {
        await this.docClient.put({
            TableName: this.taskTable,
            Item: task
        }).promise()

        return task;
    }

    async updateTask(partialTask: Partial<Task>): Promise<Task> {
        const updated = await this.docClient.update({
            TableName: this.taskTable,
            Key: { 'id': partialTask.id },
            UpdateExpression: 'set #name = :name, done = :done',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': partialTask.name,
                ':done': partialTask.done
            },
            ReturnValues: 'ALL_NEW'
        }).promise();

        return updated.Attributes as Task;
    }

    async deleteTaskById(id: string) {
        return this.docClient.delete({
            TableName: this.taskTable,
            Key: { 'id': id }
        }).promise();
    }

}

const createDynamoDBClient = () => {
    if (process.env.IS_OFFLINE) {
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000',
            accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
            secretAccessKey: 'DEFAULT_SECRET' // needed if you don't have aws credentials at all in env
        })
    }

    return new AWS.DynamoDB.DocumentClient();
}