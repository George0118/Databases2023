const express = require('express');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const router = express.Router();

router.get('/', function (req, res) {
    const successMessage = req.flash('success');
    const failureMessage = req.flash('error');

    const filePath = path.join(__dirname, '../frontend/views/login.ejs');
    fs.readFile(filePath, 'utf8', function (err, html) {
        if (err) {
            console.error('Error reading HTML file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            const renderedHtml = ejs.render(html, { successMessage, failureMessage });
            res.send(renderedHtml);
        }
    });
});

module.exports = router;
