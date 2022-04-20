# Serverless example
This project provides basic serverless configuration.
## Stack
* *Lambda*
* *IAM roles*
* *SNS*
* *SQS*
* *SES*
* *DynamoDB*



To test http lambdas You can start serverless-offline
running following command:
```
npm run serverless:offline
```

To deploy the app on AWS:
```
npm run deploy:dev
```

REMEMBER TO ADD AWS Credentials before deployment

In .vscode there is launch.json configuration which enables http lambdas debugging. To mock/play with sns event offline You need to install https://www.npmjs.com/package/serverless-offline-sns and configure it properly.

To use SQS offline You have to use elasticMQ image (https://github.com/softwaremill/elasticmq)

To test serverless offline there is postman collection available in postman folder. If You want to test Api Gateway just switch URL and request properties/bodies etc.

To send email from AWS in AWS SES section add email to verified identities. Then adjust request body.

DLQ (dead letter queue) - Works only deployed + only for async methods (SNS, SQS etc.)