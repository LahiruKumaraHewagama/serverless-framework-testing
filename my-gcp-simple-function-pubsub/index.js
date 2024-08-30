module.exports.hello = async (event) => {
    const messageData = Buffer.from(event.message.data, 'base64').toString('utf-8');
    const parsedData = JSON.parse(messageData);
  
    console.log('Parsed Data:', parsedData);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Processed successfully',
        data: parsedData
      })
    };
  };
  