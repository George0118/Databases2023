const express = require('express');
const ejs = require('ejs');
const pool = require('./connect');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {
    const failureMessage = req.flash('error');

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            q = `select Name FROM SchoolUnit;`;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {
                    const schools = [];
                    for (const row of result) {
                        schools.push(row.Name);
                    }

                    const filePath = "../frontend/views/sign_up.ejs";
                    fs.readFile(filePath, 'utf8', function (err, html) {
                        if (err) {
                            connection.release();
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            connection.release();              //release the connection so someone else can use it
                            const renderedHtml = ejs.render(html, { failureMessage, schools: schools });
                            res.send(renderedHtml);
                        }

                    });
                }
            });

        }
    });
});




module.exports = router;
