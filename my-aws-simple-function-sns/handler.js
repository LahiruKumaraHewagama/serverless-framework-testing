'use strict';

module.exports.snsHandler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // Process SNS messages here
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'SNS message processed' }),
  };
};
