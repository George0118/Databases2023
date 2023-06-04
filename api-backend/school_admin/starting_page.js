const express = require('express');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const pool = require('../connect');
const router = express.Router();

router.get('/', function (req, res) {
    const successMessage = req.flash('success');
    const failureMessage = req.flash('error');
    const user_id = req.query.user_id;
    const school_id = req.query.school_id;

    query = `SELECT Name from SchoolAdmin WHERE IdUsers = ${user_id}`;

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {

            connection.query(query, function (err, result) {
                if (err) {
                    connection.release();
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {
                    const name = result[0].Name;

                    const filePath = "../frontend/views/school_admin/starting_page.ejs";
                    fs.readFile(filePath, 'utf8', function (err, html) {
                        if (err) {
                            connection.release();
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            connection.release();
                            const renderedHtml = ejs.render(html, { name, user_id, school_id, successMessage, failureMessage });
                            res.send(renderedHtml);
                        }
                    });

                }
            });
        }
    });
});

module.exports = router;