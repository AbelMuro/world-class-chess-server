const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config()

router.get('/getname', async (req, res) => {
    const token = req.cookies.accessToken;
    const JWT_SECRET = process.env.JWT_SECRET;

    if(!token){
        res.status(403).send('third-party-cookies are not enabled in the browser');
        return;
    }
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        const username = decoded.username;

        res.status(200).send(username);        
    }
    catch(error){
        const message = error.message;
        res.status(500).send(message);
    }

})

module.exports = router;
