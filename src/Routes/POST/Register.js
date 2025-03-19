const express = require('express');
const multer = require('multer')
const EventEmitter = require('events');
const router = express.Router();
const initializeGridFs = require('../Middleware/initializeGridFs.js');
const jwt = require('jsonwebtoken');
const User = require('../../Config/MongoDB/Models/User.js');
const { config } = require('dotenv');
config();	

const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

router.post('/register', upload.single('image'), initializeGridFs, async (req, res) => {
    const {email, password, username} = req.body;
    const image = req.file;
    const gfs = req.gfs;
    const JWT_SECRET = process.env.JWT_SECRET;

    try{
        const user = new User({email, password, username});
        if(image){
            const writestream = gfs.openUploadStream(image.originalname, {
                contentType: image.mimetype
            });

            writestream.end(image.buffer);

            writestream.on('finish', async () => {
                user.profileImageId = writestream.id;       // Update the user document with the image reference    
                const userData = await user.save();             
                const token = jwt.sign({id: userData._id, email, username}, JWT_SECRET);
                res.cookie('accessToken', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',   
                })
                await sendMessageToServer(`${username} has created an account`);
                res.status(200).send('Account registered successfully'); 
              });
        
            writestream.on('error', (err) => {
                res.status(401).send('Error uploading image')
            });
        }
        else{
            const userData = await user.save();
            const token = jwt.sign({id: userData._id, email, username}, JWT_SECRET);
            res.cookie('accessToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',   
            })
            await sendMessageToServer(`${username} has created an account`);
            res.status(200).send('Account registered successfully');
        }       
    }
    catch(error){
        const message = error.message;
        await sendMessageToServer(`Internal Server Error: ${message}`);
        if(message.includes('E11000 duplicate key error collection:'))
            res.status(401).send(message);
        else
            res.status(500).send(message);
    }
})

module.exports = router;