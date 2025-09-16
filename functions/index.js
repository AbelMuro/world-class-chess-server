const serverless = require('serverless-http'); 
const app = require('../src/index.js'); 			//make sure you export the app module from the index.js

const handler = serverless(app);  		      
module.exports.handler = handler;