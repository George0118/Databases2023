const express = require('express');
const ejs = require('ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {
    const successMessage = req.flash('success');
    const failureMessage = req.flash('error');

    const user_id = req. query.user_id;
    const school_id = req.query.school_id;
    const teacher = req.query.teacher;

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            q = `SELECT r.ReservationID, b.ISBN, b.Title, GROUP_CONCAT(bw.WriterName) AS Writers, r.ReservationDate
            FROM Book b
            JOIN Reservation r ON b.ISBN = r.ISBN
            LEFT JOIN Book_Writers bw ON b.ISBN = bw.ISBN
            WHERE r.IdUsers = ${user_id}
            GROUP BY b.ISBN, b.Title, r.ReservationDate;
            `;

            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {
                    const reservations = [];
                    for (const row of result) {
                        reservations.push(row);
                    }

                    const filePath = "../frontend/views/user/reservations.ejs";
                    fs.readFile(filePath, 'utf8', function (err, html) {
                        if (err) {
                            connection.release();
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            connection.release();              //release the connection so someone else can use it
                            const renderedHtml = ejs.render(html, { teacher, school_id, user_id, successMessage, failureMessage, reservations: reservations });
                            res.send(renderedHtml);
                        }

                    });
                }
            });

        }
    });
});




module.exports = router;
