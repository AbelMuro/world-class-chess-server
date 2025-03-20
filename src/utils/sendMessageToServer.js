const fs = require('fs');
const path = require('path');
const indexFilePath = path.join(__dirname, '../index.html')

const sendMessageToServer = (message) => {

    try{
        fs.appendFile(indexFilePath, `<p>${message}</p>`, (err) => {
            if(err)
                console.log(err);
            else console.log('Content Added Successfully');
        })        
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }
}

module.exports = sendMessageToServer;