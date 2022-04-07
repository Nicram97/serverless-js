import { SQSBatchItemFailure, SQSBatchResponse, SQSHandler, SQSRecord } from "aws-lambda";

export const handler: SQSHandler = async (event): Promise<SQSBatchResponse> => {
    console.log('Error handler', event)
    const records: SQSRecord[] = event.Records;
    const sqsBatchResponse: SQSBatchResponse = {batchItemFailures: []};
    records.forEach(record => {
        const sqsBatchItemFailure: SQSBatchItemFailure = {
            itemIdentifier: record.messageId
        }

        sqsBatchResponse.batchItemFailures.push(sqsBatchItemFailure);
    });

    return sqsBatchResponse;
}