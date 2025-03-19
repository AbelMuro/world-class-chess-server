const serverless = require('serverless-http'); 
const ServerMessage = require('../src/Config/MongoDB/Models/ServerMessage.js');
const app = require('../src/index.js'); 		
const connectDB = require('../src/Config/MongoDB/DB.js');


//this is where i left off, i need to find a way to get a message from a fetch request and display it here in the return statement of my serveless function

const handler = serverless(app);  	

module.exports.handler = async (e, context) => {	
  await connectDB();		

  if(e.path === '/get_messages'){
    const allDocuments = await ServerMessage.find();
    await ServerMessage.deleteMany({});
    const formatedMessages = allDocuments.map(document => `data: ${JSON.stringify(document.message)}\n\n`).join('');

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
      body: formatedMessages
    }
  }
  else{
    const result = await handler(e, context);
    return result;    
  }
};
