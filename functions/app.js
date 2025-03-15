const serverless = require('serverless-http'); 
const app = require('../src/index.js'); 		//make sure you export the app module from the index.js
const connectDB = require('../src/Config/MongoDB/DB.js');	//if you are using mongoose

const handler = serverless(app);  		       //you can use     module.exports.handler = handler       as well

module.exports.handler = async (e, context) => {	//you can use a callback to connect to databases or some other async logic that must be implemented before every request
    await connectDB();					// you will need to call the connectDB() everytime there is a request made by the front end
    const result = await handler(e, context);
    return result;
};