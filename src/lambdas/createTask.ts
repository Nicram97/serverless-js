import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Task } from "src/interfaces/task";
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { name } = JSON.parse(event.body);

    const id = uuid.v4();
    const task: Task = { id, done: false, createdAt: new Date().toISOString(), name };

    const docClient = createDynamoDBClient();
    await docClient.put({
        TableName: process.env.TASKS_TABLE,
        Item: task
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            item: task
        })
    };
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