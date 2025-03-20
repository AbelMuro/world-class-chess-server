const express = require('express');
const sendMessageToServer = require('../../utils/sendMessageToServer.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
const router = express.Router();

config();

router.post('/logout', async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const accessToken = req.cookies.accessToken;
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    const username = decoded.email;
    
    res.cookie('accessToken', null);
    res.status(200).send('User has been logged out');
})

module.exports = router;