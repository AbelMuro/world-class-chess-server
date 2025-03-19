const serverless = require('serverless-http'); 
const app = require('../src/index.js'); 		
  const connectDB = require('../src/Config/MongoDB/DB.js');

const handler = serverless(app);  		      
module.exports.handler = async (e, context) => {	
  await connectDB();		

  if(e.path === '/get_messages'){
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      }
    }
  }
  else{
    const result = await handler(e, context);
    return result;    
  }

};