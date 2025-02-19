const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const {User} = require('../../Config/MongoDB/Models.js');

router.post('/resetpassword', async (req, res) => {
    const {token, password} = req.body;

    try{
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {$gt: Date.now()}
        });

        if(!user){
            res.status(400).send('Token is invalid or has expired');
            return;
        }

        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        res.status(200).send('Password changed successfully')
    }
    catch(error){
        const message = error.message;
        res.status(500).send(message);
    }
})

module.exports = router;