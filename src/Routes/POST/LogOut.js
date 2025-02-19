const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    res.cookie('accessToken', null);

    res.status(200).send('User has been logged out');
})

module.exports = router;