const express = require('../node_modules/express');
const ejs = require('../node_modules/ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('../node_modules/path');
const router = express.Router();

router.get('/', function (req, res) {
    const successMessage = req.flash('success');
    const failureMessage = req.flash('error');

    const user_id = req.query.user_id;

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            q = `select DISTINCT * FROM 
            (SchoolAdmin JOIN Users ON SchoolAdmin.IdUsers = Users.IdUsers)
            JOIN SchoolUnit ON SchoolAdmin.IdSchool = SchoolUnit.IdSchool;`;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();              //release the connection so someone else can use it
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {
                    const admins = [];
                    for (const row of result) {
                        admins.push(row);
                    }
                    connection.release();              //release the connection so someone else can use it
                    const filePath = "../frontend/views/general_admin/admins.ejs";
                    fs.readFile(filePath, 'utf8', function (err, html) {
                        if (err) {
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            const renderedHtml = ejs.render(html, { user_id, successMessage, failureMessage, admins: admins });
                            res.send(renderedHtml);
                        }

                    });
                }
            });

        }
    });
});




module.exports = router;
