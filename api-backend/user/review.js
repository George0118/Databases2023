const express = require('express');
const pool = require('../connect');
const router = express.Router();
const fs = require('fs');
const ejs = require('ejs');

router.post('/', function (req, res) {
    const isbn = req.body.ISBN;
    const title = req.body.Title;
    const user_id = req.body.user_id;
    const school_id = req.body.school_id;
    const teacher = req.body.teacher;

    const filePath = "../frontend/views/user/review.ejs";
    fs.readFile(filePath, 'utf8', function (err, html) {
        if (err) {
            console.error('Error reading HTML file:', err);
            res.status(500).send('Internal Server Error');
        } else {
            const renderedHtml = ejs.render(html, { teacher, school_id, user_id, isbn, title });
            res.send(renderedHtml);
        }

    });
});




module.exports = router;