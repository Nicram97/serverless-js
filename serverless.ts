import { CustomServerless } from "./customServerless";


const serverlessConfiguration: CustomServerless = {
    service: 'serverlessSetup',
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        stage: "${opt:stage, 'development'}",
        region: 'eu-west-1',
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            TASKS_TABLE: 'Tasks-${self:provider.stage}',
            MY_AWS_REGION: '${self:provider.region}',
            MY_AWS_ACCOUNT_ID: '${aws:accountId}'
        },
    },
    package: {
        individually: true
    },
    functions: {

        hello: {
            handler: 'src/lambdas/hello.handler',
            events: [
                {
                    http: {
                        path: 'serverlessSetup/hello',
                        method: 'get'
                    }
                },
            ],
        },

        nestJsHello: {
            handler: 'src/lambdas/nestLambda/nestHello.handler',
            events: [
                {
                    http: {
                        path: 'serverlessSetup/nestHello',
                        method: 'get'
                    }
                },
            ],
        },

        goodbye: {
            handler: 'src/lambdas/goodbye.handler',
            events: [
                {
                    http: {
                        path: 'serverlessSetup/goodbye',
                        method: 'post'
                    }
                },
            ],
        },

        question: {
            handler: 'src/lambdas/question.handler',
            maximumRetryAttempts: 0,
            maximumEventAge: 60,
            destinations: {
                onFailure: '${self:custom.failureArn}'
            },
            events: [
                {
                    sns: {
                        arn: '${self:custom.snsQuestionArn}',
                        topicName: 'question-event'
                    },
                },
            ],
            // @ts-expect-error
            iamRoleStatements: [
                {
                    Effect: 'Allow',
                    Action: ['sns:Subscribe', 'sns:Publish'],
                    Resource: '${self:custom.snsQuestionArn}'
                },
                {
                    Effect: 'Allow',
                    Action: ['sqs:SendMessage'],
                    Resource: '${self:custom.failureArn}'
                },
            ],
        },

        createTask: {
            handler: 'src/lambdas/createTask.handler',
            events: [
                {
                    http: {
                        path: 'tasks',
                        method: 'post'
                    }
                },
            ],
            // @ts-expect-error
            iamRoleStatements: [
                {
                    Effect: 'Allow',
                    Action: ['dynamodb:PutItem'],
                    Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TASKS_TABLE}'
                },
            ],
        },

        getTasks: {
            handler: 'src/lambdas/getTasks.handler',
            events: [
                {
                    http: {
                        path: 'tasks',
                        method: 'get'
                    }
                },
            ],
            // @ts-expect-error
            iamRoleStatements: [
                {
                    Effect: 'Allow',
                    Action: ['dynamodb:Scan'],
                    Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TASKS_TABLE}'
                },
            ],
        },

        updateTask: {
            handler: 'src/lambdas/updateTask.handler',
            events: [
                {
                    http: {
                        path: 'tasks/{id}',
                        method: 'patch'
                    }
                },
            ],
            // @ts-expect-error
            iamRoleStatements: [
                {
                    Effect: 'Allow',
                    Action: ['dynamodb:UpdateItem'],
                    Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TASKS_TABLE}'
                },
            ],
        },

        deleteTask: {
            handler: 'src/lambdas/deleteTask.handler',
            events: [
                {
                    http: {
                        path: 'tasks/{id}',
                        method: 'delete'
                    }
                },
            ],
            // @ts-expect-error
            iamRoleStatements: [
                {
                    Effect: 'Allow',
                    Action: ['dynamodb:DeleteItem'],
                    Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TASKS_TABLE}'
                },
            ],
        },

        sendEmail: {
            handler: 'src/lambdas/sendEmail.handler',
            dependsOn: [
                'SNSSendEmailEvent'
            ],
            events: [
                {
                    http: {
                        path: 'serverlessSetup/sendEmail',
                        method: 'post'
                    },
                },
                {
                    sns: {
                        arn: '${self:custom.snsEmailArn}',
                        topicName: 'email-event'
                    },
                },
            ],
            // @ts-expect-error
            iamRoleStatements: [
                {
                    Effect: 'Allow',
                    Action: ['ses:SendEmail'],
                    Resource: 'arn:aws:ses:${self:provider.region}:${aws:accountId}:*'
                },
            ],
        },

        handleDLQ: {
            handler: 'src/lambdas/handleDLQ.handler',
            maximumRetryAttempts: 0,
            maximumEventAge: 60,
            events: [
                {
                    sqs: {
                        batchSize: 1, // in reality you would have your lambda batch process but setting to 1 for example
                        maximumBatchingWindow: 1,
                        arn: { 'Fn::GetAtt': ['DeadLetterQueue', 'Arn'] },
                    }
                },
            ],
            // @ts-expect-error
            iamRoleStatements: [
                {
                    Effect: 'Allow',
                    Action: ['sqs:ReceiveMessage'],
                    Resource: '${self:custom.failureArn}'
                },
            ],
        },

        sendToSns: {
            handler: 'src/lambdas/sendToSns.handler',
            events: [
                {
                    http: {
                        path: 'serverlessSetup/sendToSns',
                        method: 'post'
                    },
                },
            ],
            // @ts-expect-error
            iamRoleStatements: [
                {
                    Effect: 'Allow',
                    Action: ['sns:Publish'],
                    Resource: '${self:custom.allSnsArn}'
                },
            ],
        },

        sendToSqs: {
            handler: 'src/lambdas/sendToSqs.handler',
            events: [
                {
                    http: {
                        path: 'serverlessSetup/sendToSqs',
                        method: 'post'
                    },
                },
            ],
            // @ts-expect-error
            iamRoleStatements: [
                {
                    Effect: 'Allow',
                    Action: ['sqs:SendMessage'],
                    Resource: '${self:custom.allSqsArn}'
                },
            ],
        },

        receiver: {
            handler: 'src/lambdas/receiverSqs.handler',
            maximumRetryAttempts: 0,
            maximumEventAge: 60,
            events: [
                {
                    sqs: {
                        batchSize: 1, // in reality you would have your lambda batch process but setting to 1 for example
                        maximumBatchingWindow: 1,
                        arn: { 'Fn::GetAtt': ['MyQueue', 'Arn'] },
                    }
                },
            ],
            // @ts-expect-error
            iamRoleStatements: [
                {
                    Effect: 'Allow',
                    Action: ['sqs:ReceiveMessage'],
                    Resource: '${self:custom.receiverArn}'
                },
            ],
        },

        helloThere: {
            handler: 'src/lambdas/stepFunctions/helloThere.handler'
        },

        generalKenobi: {
            handler: 'src/lambdas/stepFunctions/generalKenobi.handler'
        },

        startSF: {
            handler: 'src/lambdas/stepFunctions/startSF.handler',
            events: [
                {
                    http: {
                        path: 'startSF',
                        method: 'post'
                    },
                },
            ],
            // @ts-expect-error
            iamRoleStatements: [
                {
                    Effect: 'Allow',
                    Action: ['states:StartExecution'],
                    Resource: 'arn:aws:states:*:*:stateMachine:*'
                },
            ],
        },

        publishToEventBus: {
            handler: 'src/lambdas/eventBridge/publishToEventBus.handler',
            events: [
                {
                    http: {
                        path: 'publishToEventBus',
                        method: 'post',
                    }
                },
            ],
        },

    },
    stepFunctions: {
        stateMachines: {
            WaitMachine: {
                id: 'WaitMachine',
                name: 'GeneralKenobi',
                definition: {
                    Comment: 'Step function example!',
                    StartAt: 'FirstState',
                    States: {
                        FirstState: {
                            Type: 'Task',
                            Resource: { 'Fn::GetAtt': ['helloThere', 'Arn'] },
                            Next: 'wait_using_seconds',
                        },
                        wait_using_seconds: {
                            Type: 'Wait',
                            Seconds: 10,
                            Next: 'FinalState',
                        },
                        FinalState: {
                            Type: 'Task',
                            Resource: { 'Fn::GetAtt': ['generalKenobi', 'Arn'] },
                            End: true,
                        },
                    },
                },
            },
        },
    },

    custom: {
        failureArn: 'arn:aws:sqs:${self:provider.region}:${aws:accountId}:deadLetterQueue',
        receiverArn: 'arn:aws:sqs:${self:provider.region}:${aws:accountId}:MyQueue',
        allSqsArn: 'arn:aws:sqs:${self:provider.region}:${aws:accountId}:*',
        allSnsArn: 'arn:aws:sns:${self:provider.region}:${aws:accountId}:*',
        snsQuestionArn: 'arn:aws:sns:${self:provider.region}:${aws:accountId}:question-event',
        snsEmailArn: 'arn:aws:sns:${self:provider.region}:${aws:accountId}:email-event',

        webpack: {
            webpackConfig: 'webpack.config.ts', // Name of webpack configuration file
            includeModules: true, // Node modules configuration for packaging
            packager: 'npm', // Packager that will be used to package your external modules
            excludeFiles: 'src/**/*.test.js', // Provide a glob for files to ignore
        },

        ['serverless-offline']: {
            httpPort: 3003,
        },

        dynamodb: {
            stages: ['development'],
            start: {
                port: 8078,
                inMemory: true,
                migrate: true
            },
        },

        ['serverless-offline-ses-v2']: {
            port: 8064,
        },

        ['serverless-offline-sns']: {
            port: 4002,
            debug: false,
        },

        ['serverless-offline-sqs']: {
            autoCreate: true,
            debug: true,              // create queue if not exists
            apiVersion: '2012-11-05',
            endpoint: 'http://0.0.0.0:9324',
            region: '${self:provider.region}',
            accessKeyId: 'root',
            secretAccessKey: 'root',
            skipCacheInvalidation: false,
        },

        stepFunctionsLocal: {
            accountId: '${aws:accountId}',
            region: '${self:provider.region}',
            TaskResourceMapping: {
                FirstState: 'arn:aws:lambda:${self:provider.region}:${aws:accountId}:function:helloThere',
                FinalState: 'arn:aws:lambda:${self:provider.region}:${aws:accountId}:function:generalKenobi',
            },
        },

        ['serverless-offline-aws-eventbridge']: {
            port: 4010,
            mockEventBridgeServer: true,
            hostname: '127.0.0.1',
            pubSubPort: 4011,
            debug: false,
            account: '',
            maximumRetryAttempts: 1,
            retryDelayMs: 500,
            payloadSizeLimit: '10mb'
        },
    },

    resources: {
        Resources: {
            SNSQuestionEvent: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    DisplayName: 'Question Event Topic',
                    TopicName: 'question-event'
                },
            },
            SNSSendEmailEvent: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    DisplayName: 'Send email Event Topic',
                    TopicName: 'email-event'
                },
            },
            TasksDynamoDBTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: '${self:provider.environment.TASKS_TABLE}',
                    AttributeDefinitions: [
                        {
                            AttributeName: 'id',
                            AttributeType: 'S',
                        },
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'id',
                            KeyType: 'HASH',
                        },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                },
            },
            MyQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'MyQueue',
                },
            },
            DeadLetterQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'deadLetterQueue',
                },
            },
        },
    },

    plugins: [
        'serverless-webpack',
        'serverless-step-functions',
        'serverless-iam-roles-per-function',
        'serverless-step-functions-local',
        'serverless-offline-lambda',
        'serverless-offline',
        'serverless-offline-aws-eventbridge',
        'serverless-dynamodb-local',
        'serverless-offline-sqs',
        'serverless-offline-sns',
        'serverless-offline-ses-v2'
    ],
};

module.exports = serverlessConfiguration;
