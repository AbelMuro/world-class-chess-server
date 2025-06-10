const express = require('express');
const mongoose = require('mongoose');
const initializeGridFs = require('../Middleware/initializeGridFs.js');
const User = require('../../Config/MongoDB/Models/User.js');
const router = express.Router();


router.get('/get_player_account/:username', initializeGridFs, async (req, res) => {
    const username = req.params.username;
    const gfs = req.gfs;

    try{
        const account = await User.find({username});
        const profileImageId = account.profileImageId;

        if(profileImageId){
            const _id = new mongoose.Types.ObjectId(profileImageId);
            const cursor = gfs.find({_id});
            const file = await cursor.next();
            const chunks = [];
            const readstream = gfs.openDownloadStream(_id);

            readstream.on('data', (chunk) => {
                chunks.push(chunk);
            })

            readstream.on('end', () => {
                const fileBuffer = Buffer.concat(chunks);
                res.status(200).json({
                    username,
                    contentType: file.contentType,
                    imageBase64: fileBuffer.toString('base64')
                })
            })

            readstream.on('error', (err) => {
                console.log('Error reading file from MongoDB', err);
                res.status(200).json({
                    username,
                    contentType: '',
                    imageBase64: ''
                })
            })
        }
        else
            res.status(200).json({
                username,
                contentType: '',
                imageBase64: ''
            })

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message)
    }
})

module.exports = router;