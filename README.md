# Serverless example
This project provides basic serverless configuration with 2 http based lambdas and 1 event based.

To test http lambdas You can start serverless-offline
running following command:
```
npm run start:aws:offline
```

In .vscode there is launch.json configuration which enables http lambdas debugging. To mock/play with sns event offline You need to install https://www.npmjs.com/package/serverless-offline-sns and configure it properly.