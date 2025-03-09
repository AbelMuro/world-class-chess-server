const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../Config/MongoDB/Models/User.js');
const { config } = require('dotenv');
config();	

router.post('/register', async (req, res) => {
    const {email, password, username} = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;

    try{
        const user = new User({email, password, username});
        const userData = await user.save();

        const token = jwt.sign({id: userData._id, email, username}, JWT_SECRET);

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',   
        })

        res.status(200).send('Account registered successfully');
    }
    catch(error){
        const message = error.message;
        if(message.includes('E11000 duplicate key error collection:'))
            res.status(401).send(message);
        else
            res.status(500).send(message);
    }
})

module.exports = router;