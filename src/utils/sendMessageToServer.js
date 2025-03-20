const fs = require('fs');
const path = require('path');
const indexFilePath = path.join(__dirname, '../index.html')

const sendMessageToServer = (message) => {
    fs.appendFile(indexFilePath, `<p>${message}</p>`, (err) => {
        if(err)
            console.log(err);
        else console.log('Content Added Successfully');
    })
}

module.exports = sendMessageToServer;