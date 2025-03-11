const express = require('express');
const mongoose = require('mongoose');
const {GridFSBucket} = require('mongodb');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../Config/MongoDB/Models/User.js');
const {config} = require('dotenv');
config();

const initializeGridFs = (req, res, next) => {
    const conn = mongoose.connection;
    const gfs = new GridFSBucket(conn.db, { bucketName: 'images' });
    req.gfs = gfs;
    next();
}

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
        const image = user.profileImage;

        if(image){
            const _id = new mongoose.Types.ObjectId(image);
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
