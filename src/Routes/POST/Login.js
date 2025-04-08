const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../Config/MongoDB/Models/User.js');
const {config} = require('dotenv');
config();

router.post('/login', () => {console.log('login route')}, async (req, res) => {
    const {email, password} = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;

    try{
        const user = await User.findOne({email});

        if(!user || !(await user.matchPassword(password))){
            res.status(401).send('Email or password is incorrect');
            return;
        }

        const token = jwt.sign({id: user._id, email, username: user.username, profileImageId: user.profileImageId}, JWT_SECRET);

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        res.status(200).send('User has successfully logged in');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }

})

module.exports = router;