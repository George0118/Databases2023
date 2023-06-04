const express = require('express');
const ejs = require('ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {
    const failureMessage = req.flash('error');
    const successMessage = req.flash('success');

    const school_id = req.query.school_id;
    const user_id = req.query.user_id;

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            q = `SELECT Users.IdUsers
            FROM (
                SELECT IdUsers
                FROM Teacher
                WHERE IdSchool = ${school_id}
                UNION
                SELECT IdUsers
                FROM Student
                WHERE IdSchool = ${school_id}
            ) AS UsersInSchool
            JOIN Users ON Users.IdUsers = UsersInSchool.IdUsers
            WHERE Users.Approved = 1
            ORDER BY Users.IdUsers ASC;
            `;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {
                    const users = [];
                    for (const row of result) {
                        users.push(row.IdUsers);
                    }

                    const q1 = `SELECT ISBN
                    FROM Availability
                    WHERE IdSchool = ${school_id};
                    `;

                    connection.query(q1, function (err, result) {
                        if (err) {
                            connection.release();
                            res.status(400).json({ status: "failed", reason: "Error executing query." });
                            console.log(err);
                        }
                        else {
                            const isbns = [];
                            for (const row of result) {
                                isbns.push(row.ISBN);
                            }

                            const filePath = "../frontend/views/school_admin/borrow_without_reservation.ejs";
                            fs.readFile(filePath, 'utf8', function (err, html) {
                                if (err) {
                                    connection.release();
                                    console.error('Error reading HTML file:', err);
                                    res.status(500).send('Internal Server Error');
                                } else {
                                    connection.release();              //release the connection so someone else can use it
                                    const renderedHtml = ejs.render(html, { user_id, school_id, successMessage, failureMessage, users: users, isbns: isbns });
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
