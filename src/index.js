const express = require('express');     
const cookieParser = require('cookie-parser');       
const cors = require('cors');    
const url = require('url');
const WebSocket = require('ws');
const Queue = require('./Config/MongoDB/Models/Queue.js');
const Match = require('./Config/MongoDB/Models/Match.js');
const Login = require('./Routes/POST/Login.js');     
const Register = require('./Routes/POST/Register.js');   
const ForgotPassword = require('./Routes/POST/ForgotPassword.js');
const ResetPassword = require('./Routes/POST/ResetPassword.js');
const LogOut = require('./Routes/POST/LogOut.js');
const GuestLogin = require('./Routes/POST/GuestLogin.js');
const UpdateMatch = require('./Routes/PUT/UpdateMatch.js');
const GetMatch = require('./Routes/GET/GetMatch.js');
const AIMove = require('./Routes/POST/AI_Move.js')
const putPlayerInQueue = require('./Routes/POST/PutPlayerInQueue.js');
const getAccount = require('./Routes/GET/GetAccount.js');
const createMatch = require('./Routes/POST/CreateMatch.js');
const deleteMatch = require('./Routes/DELETE/DeleteMatch.js');
const CreateWebSocket = require('./Config/Websockets/CreateWebSocket.js');
const fs = require('fs');
const path = require('path');
const https = require('https');
const connectDB = require('./Config/MongoDB/DB.js');     
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

connectDB();
const app = express();   
const indexFilePath = path.join(__dirname, 'index.html');   
const privateKeyFilePath = path.join(__dirname, '../SSL/private.key');
const certificateFilePath = path.join(__dirname, '../SSL/certificate.cer'); 
const HTTP_PORT = process.env.PORT || 8080;
const HTTPS_PORT = 443

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['https://world-class-chess.netlify.app', 'http://localhost:3000'],						//Access-Control-Allow-Origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],			                                    //Access-Control-Allow-Headers
    credentials: true,
    maxAge: 3600,
    optionsSuccessStatus: 200
}))
app.use(Login);
app.use(Register);
app.use(ForgotPassword);
app.use(ResetPassword);
app.use(LogOut);
app.use(GuestLogin);
app.use(getAccount);
app.use(AIMove);
app.use(UpdateMatch);
app.use(GetMatch);
app.use(putPlayerInQueue);
app.use(createMatch);
app.use(deleteMatch);
app.get('/', (req, res) => {
    res.sendFile(indexFilePath);
})

const httpServer = app.listen(HTTP_PORT, (error) => {
    if(error){
        console.log('HTTP error occurred: ', error);
        return;
    }
    console.log(`HTTP Server is running on port ${HTTP_PORT}`);
});  


const options = {
    key: fs.readFileSync(privateKeyFilePath),
    cert: fs.readFileSync(certificateFilePath),
}

const httpsServer = https.createServer(options, app).listen(HTTPS_PORT, (error) => {
    if(error)
        console.log('HTTPS error occurred: ', error);
    else
        console.log(`HTTPS server is running on port ${HTTPS_PORT}`);
});    

httpsServer.on('upgrade', (request, socket, head) => {
    const pathname = url.parse(request.url, true).pathname;
    const wss = global.webSocketHandlers[pathname];    
    
    if (wss) {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();                                   // Gracefully close invalid connections
    }
});

global.webSocketHandlers = {};                              // this global variable is being used ONLY in ./Config/Websockets/CreateWebSocket.js


CreateWebSocket('queue', async (ws, req) => {                                 
    console.log('Front-end and back-end are connected, waiting for updates on queue collection in database');

    const params = url.parse(req.url, true).query;
    ws.username = params.username;

    const allDocuments = await Queue.find();
    ws.send(JSON.stringify(allDocuments));

    const changeStream = Queue.watch();

    changeStream.on('change', async () => {
        const queue = await Queue.find();
        const documents = JSON.stringify(queue);
        ws.send(documents);  
    })

    changeStream.on('error', (error) => {
        console.log(`mongoDB change stream error: ${error}`);
    })    
    
                                
    ws.on('close', async () => {                                        
        console.log('Front-end has disconnected from queue websocket');
        try{
            const username = ws.username;
            const result = await Queue.deleteOne({player: username});
            console.log(result.deletedCount === 1 ? 
                `${username} has been removed from the queue`: 
                `${username} was not in the queue`)
        }
        catch(error){
            const message = error.message;
            console.error('Error occurred in queue websocket in close event ', message)
        }        
    })
});


CreateWebSocket('signal', function(ws, req) {
    console.log('Front-end and back-end are connected, waiting to initiate signal to clients');
    const params = url.parse(req.url, true).query;
    ws.username = params.username;

    ws.on('message', (offer) => {
        const currentOffer = JSON.parse(offer);
        const offerTo = currentOffer.to;
        console.log(offerTo);

        this.clients.forEach(client => {                        //this will traverse through ALL the clients that are connected to the websocket
            if(client !== ws && client.readyState === WebSocket.OPEN && client.username === offerTo)
                client.send(offer);   
        })            
    })
})


CreateWebSocket('match', async (ws, req) => {
    console.log('Front-end and back-end are connected, two players have connnected to a match');
    const params = url.parse(req.url, true).query;
    ws.matchId = params.matchId;
    
    const changeStream = Match.watch([                                  
        { $match: { 'fullDocument._id': new ObjectId(ws.matchId)} }
    ], { fullDocument: 'updateLookup' });   

    changeStream.on('change', (change) => {
        console.log('change has been detected');
        const fullDocument = change.fullDocument;
        ws.send(JSON.stringify(fullDocument));
    })

    ws.on('close', async () => {
        console.log('Front-end has disconnected from match websocket')
    })

})