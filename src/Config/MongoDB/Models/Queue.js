const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const WebSocket = require('ws');
const https = require('https');

const queueSchema = new Schema({
    player: {type: String, required: true, unique: true},
    profileImageBase64: {type: String},
    contentType: {type: String}
})

const Queue = mongoose.model('player', queueSchema, 'queue')

const changeStream = Queue.watch();

const server = https.createServer({                               
    cert: fs.readFileSync('/path/to/ssl/cert.pem'),                
    key: fs.readFileSync('/path/to/ssl/key.pem'),                  
});  


const wss = new WebSocket.Server({server});

wss.on('connection', ws => {                                        //Third, you establish the connection between the back end and the front end
    console.log('Front-end and back-end are connected');

    changeStream.on('change', (change) => {
        ws.send('data goes here')  
    })
                                
    ws.on('close', () => {                                        //Event listener that is triggered when the front-end is disconnected from the back-end
        console.log('Client disconnected')
    })
})




module.exports = Queue
