# Serverless example
This project provides basic serverless configuration with 2 http based lambdas and 1 event based.

To test http lambdas You can start serverless-offline
running following command:
```
npm run serverless:offline
```

To deploy the app on AWS:
```
npm run serverless remove -- -s development
```

REMEMBER TO ADD AWS Credentials before deployment

In .vscode there is launch.json configuration which enables http lambdas debugging. To mock/play with sns event offline You need to install https://www.npmjs.com/package/serverless-offline-sns and configure it properly.