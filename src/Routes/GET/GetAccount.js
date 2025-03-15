const express = require('express');
const initializeGridFs = require('../Middleware/initializeGridFs.js');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../Config/MongoDB/Models/User.js');
const {config} = require('dotenv');
config();

router.get('/get_account', initializeGridFs, async (req, res) => {
    const token = req.cookies.accessToken;
    const JWT_SECRET = process.env.JWT_SECRET;
    const gfs = req.gfs;

    if(!token){
        res.status(403).send('third-party-cookies are not enabled in the browser');
        return;
    }
    else if(token === 'guest'){
        res.status(200).json({username: 'Guest', email: '', image: null});
        return;
    }
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const email = decoded.email;
        const user = await User.findOne({email});
        const username = user.username;
        const imageId = user.profileImageId;

        if(imageId){
            const _id = new mongoose.Types.ObjectId(imageId);
            const cursor = gfs.find({_id});
            const files = await cursor.toArray();
            const file = files?.[0];
            const chunks = [];
            const readstream = gfs.openDownloadStream(_id);

            readstream.on('data', (chunk) => {
                chunks.push(chunk);
            })

            readstream.on('end', () => {
                const fileBuffer = Buffer.concat(chunks);
                res.status(200).json({
                    username,
                    email,
                    contentType: file.contentType,
                    image: fileBuffer.toString('base64')
                })
            })

            readstream.on('error', (err) => {
                console.log('Error reading file from MongoDB', err);
                res.status(200).json({username, email})
            })
        }  
        else
            res.status(200).json({username, email});
         
    }
    catch(error){
        const message = error.message;
        res.status(500).send(message);
    }
})

module.exports = router;
