const express = require('express');     
const cookieParser = require('cookie-parser');       
const cors = require('cors');    
const Login = require('./Routes/POST/Login.js');     
const Register = require('./Routes/POST/Register.js');   
const ForgotPassword = require('./Routes/POST/ForgotPassword.js');
const ResetPassword = require('./Routes/POST/ResetPassword.js');
const LogOut = require('./Routes/POST/LogOut.js');
const GuestLogin = require('./Routes/POST/GuestLogin.js');
const CreateMatch = require('./Routes/POST/CreateMatch.js');
const UpdateMatch = require('./Routes/PUT/UpdateMatch.js');
const GetMatch = require('./Routes/GET/GetMatch.js');
const AIMove = require('./Routes/POST/AI_Move.js')
const putPlayerInQueue = require('./Routes/POST/PutPlayerInQueue.js');
const leaveQueue = require('./Routes/DELETE/LeaveQueue.js');
const getAccount = require('./Routes/GET/GetAccount.js');
const sendInvitation = require('./Routes/POST/SendInvitation.js');
const fs = require('fs');
const path = require('path');
const https = require('https');
const CreateWebSocket = require('./Config/Websockets/CreateWebSocket.js');
const Queue = require('./Config/MongoDB/Models/Queue.js');
const connectDB = require('./Config/MongoDB/DB.js');     

connectDB();
const app = express();   
const indexFilePath = path.join(__dirname, 'index.html');   
const privateKeyFilePath = path.join(__dirname, '../SSL/private.key');
const certificateFilePath = path.join(__dirname, '../SSL/certificate.cer'); 
const HTTP_port = process.env.PORT || 8080;
const HTTPS_port = 443

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
app.use(CreateMatch);
app.use(UpdateMatch);
app.use(GetMatch);
app.use(putPlayerInQueue);
app.use(leaveQueue);
app.use(sendInvitation);

app.get('/', (req, res) => {
    res.sendFile(indexFilePath);
})

const options = {
    key: fs.readFileSync(privateKeyFilePath),
    cert: fs.readFileSync(certificateFilePath),
}

 const httpsServer = https.createServer(options, app).listen(HTTPS_port, (error) => {
    if(error){
        console.log('HTTPS error occurred: ', error);
        return;
    }
    console.log('HTTPS server is running on port 443')
});

CreateWebSocket(httpsServer, 'queue', ws => {                                    //we establish the connection between the back end and the front end
        console.log('Front-end and back-end are connected, waiting for updates on queue collection in database');
        const changeStream = Queue.watch();

        changeStream.on('change', async () => {
            const queue = await Queue.find();
            const documents = JSON.stringify(queue);
            ws.send(documents);  
        })

        changeStream.on('error', (error) => {
            console.log(`mongoDB change stream error: ${error}`);
        })            
                                    
        ws.on('close', () => {                                        //Event listener that is triggered when the front-end is disconnected from the back-end
            console.log('Client disconnected')
        })
});

app.listen(HTTP_port , (error) => {
    if(error){
        console.log(error, 'error occured');
        return;
    }
    console.log(`HTTP Server is running on port ${HTTP_port}`);
});  

module.exports = {httpsServer};