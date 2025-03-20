const serverless = require('serverless-http'); 
const app = require('../src/index.js'); 		
const connectDB = require('../src/Config/MongoDB/DB.js');

const handler = serverless(app);  	

module.exports.handler = async (e, context) => {	
  await connectDB();		
  const result = await handler(e, context);
  return result;    
};
