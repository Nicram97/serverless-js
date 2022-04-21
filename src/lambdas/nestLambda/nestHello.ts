import { HttpStatus } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { AppModule } from './app.module';
import { AppService } from './app.service';

export const handler: APIGatewayProxyHandler = async (
  _event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const appService = appContext.get(AppService);

  return {
    body: appService.getHello(),
    statusCode: HttpStatus.OK,
  };
};
