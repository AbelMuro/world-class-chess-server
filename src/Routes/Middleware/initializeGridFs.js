const mongoose = require('mongoose');
const { GridFSBucket} = require('mongodb');

const initializeGridFs = (req, res, next) => {
    const conn = mongoose.connection;
    const gfs = new GridFSBucket(conn.db, {bucketName: 'images'});
    req.gfs = gfs;
    next();
}

module.exports = initializeGridFs;