const express = require('express');
const router = express.Router();
const {config} = require('dotenv');
config();

router.post('/guestlogin', async (req, res) => {
    res.cookie('accessToken', 'guest', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });

    res.status(200).send('User has successfully logged in as guest');
})

module.exports = router;