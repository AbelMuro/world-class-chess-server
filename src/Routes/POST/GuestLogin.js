const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.post('/guestlogin', async (req, res) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    let username = 'Guest-'

    for(let i = 0; i < 5; i++)
        username += Math.floor(Math.random() * 9);

    const token = jwt.sign({id: 'guest', email: null, username, profileImageId: ''}, JWT_SECRET);

    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });

    res.status(200).send('User has successfully logged in as guest');
})

module.exports = router;