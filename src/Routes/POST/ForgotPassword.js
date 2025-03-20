const express = require('express');
const router = express.Router();
const User = require('../../Config/MongoDB/Models/User.js');
const sendMessageToServer = require('../../utils/sendMessageToServer.js');
const nodemailer = require('nodemailer');
const {config} = require('dotenv');
config();

router.post('/forgotpassword', async (req, res) => {
    const {email} = req.body;

    try{
        const user = await User.findOne({email});

        if(!user){
            res.status(401).send("Email doesn't exist");
            return;
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({validateBeforeSave: false});
        const resetPasswordLink = `http://localhost:3000/resetpassword/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.email,
                pass: process.env.app_password
            }
        })

        const mailOption = {
            from: process.env.email,
            to: email,
            subject: 'Reset link for World-Class-Chess account',
            text: `Please click on the following link to reset your password ${resetPasswordLink}`
        }

        transporter.sendMail(mailOption, async (error, info) => {
            if(error){
                res.status(401).send(error.message);
                return;
            }
            else{
                sendMessageToServer(`Account with email: ${email}, has forgotten their password, reset link has been sent to their email address`)
                res.status(200).send('Email sent successfully');
            }
        })
    }
    catch(error){
        const message = error.message;
        sendMessageToServer(`Internal Server Error: ${message}`);
        res.status(500).send(message);
    }
})

module.exports = router;