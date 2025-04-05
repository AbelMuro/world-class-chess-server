const express = require('express');
const router = express.Router();

router.delete('/delete_websockets', (req, res) => {

    try{
        const websockets = global.webSocketHandlers;

        for(let wss of Object.values(websockets)){
            wss.clients.forEach((client) => {
                if(client.readyState === WebSocket.OPEN)
                    client.close();
            });  

            wss.close();
        }     

        global.webSocketHandlers = {};
        res.status(200).send('All websocket servers have closed successfully');   
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }

})

module.exports = router;