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
const initializeWebsockets = require('./Routes/POST/InitializeWebsockets.js');
const connectDB = require('./Config/MongoDB/DB.js');     

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
app.use(CreateMatch);
app.use(UpdateMatch);
app.use(GetMatch);
app.use(putPlayerInQueue);
app.use(leaveQueue);
app.use(sendInvitation);
app.use(initializeWebsockets);
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

//this global variable is being used ONLY in the ./Config/Websockets/CreateWebSocket.js file
global.httpsServer = https.createServer(options, app).listen(HTTPS_PORT, (error) => {
    if(error)
        console.log('HTTPS error occurred: ', error);
    else
        console.log(`HTTPS server is running on port ${HTTPS_PORT}`);
});           