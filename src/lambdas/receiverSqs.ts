import { SQSHandler, SQSRecord } from 'aws-lambda';

export const handler: SQSHandler = async (event): Promise<void> => {
  console.log('receiverSqs');
  const records: SQSRecord[] = event.Records;
  records.forEach((record) => {
    console.log('SQS result', record);
  });
};
