const mongoose = require('mongoose');
const { GridFSBucket} = require('mongodb');

const initializeGridFs = (req, res, next) => {
    try{
        const conn = mongoose.connection;
        const gfs = new GridFSBucket(conn.db, {bucketName: 'images'});
        req.gfs = gfs;
        next();        
    }
    catch(error){
        const message = error.message;
        res.status(500).send(`initializeGridFS(): ${message}`);
    }
}

module.exports = initializeGridFs;