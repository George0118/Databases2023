const express = require('express');
const ejs = require('ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {
    const successMessage = req.flash('success');
    const failureMessage = req.flash('error');

    const teacher_str = req.query.teacher;
    const user_id = req.query.user_id;
    const school_id = req.query.school_id;

    var teacher;

    if (teacher_str === "true") {
        teacher = true;
    }
    else {
        teacher = false;
    }

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            var q;
            if (teacher) {
                q = `SELECT *
                FROM Teacher
                JOIN Users ON Teacher.IdUsers = Users.IdUsers
                WHERE Teacher.IdUsers = ${user_id};                    
                `;
            }
            else {
                q = `SELECT *
                FROM Student
                JOIN Users ON Student.IdUsers = Users.IdUsers
                WHERE Student.IdUsers = ${user_id};                    
                `;
            }

            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {
                    const data = [];
                    for (const row of result) {
                        data.push(row);
                    }

                    const query = `SELECT *
                        FROM TelephoneUser
                        WHERE IdUsers = ${user_id};                    
                        `;

                    connection.query(query, function (err, result) {
                        if (err) {
                            connection.release();
                            res.status(400).json({ status: "failed", reason: "Error executing query." });
                            console.log(err);
                        }
                        else {
                            const phone_numbers = [];
                            for (const row of result) {
                                phone_numbers.push(row);
                            }

                            const filePath = "../frontend/views/user/user_data.ejs";
                            fs.readFile(filePath, 'utf8', function (err, html) {
                                if (err) {
                                    connection.release();
                                    console.error('Error reading HTML file:', err);
                                    res.status(500).send('Internal Server Error');
                                } else {
                                    connection.release();              //release the connection so someone else can use it
                                    const renderedHtml = ejs.render(html, { user_id, school_id, successMessage, failureMessage, teacher, data: data, phone_numbers: phone_numbers });
                                    res.send(renderedHtml);
                                }

                            });
                        }
                    });
                }
            });

        }
    });
});




module.exports = router;
