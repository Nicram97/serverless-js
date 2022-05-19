export const handler: any = async (
    event: any,
  ): Promise<any> => {
    try {
      console.log('4th consumer', event);
      const response = {
        statusCode: 200,
        body: JSON.stringify(event),
      };
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  };