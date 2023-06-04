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
            q = `SELECT bor.BorrowingID, b.ISBN, b.Title, GROUP_CONCAT(DISTINCT bw.WriterName SEPARATOR ', ') AS Writers, r.RatingLikert
            FROM Borrowing bor
            JOIN Book b ON bor.ISBN = b.ISBN
            JOIN Book_Writers bw ON b.ISBN = bw.ISBN
            LEFT JOIN Review r ON b.ISBN = r.ISBN AND r.IdUsers = bor.IdUsers
            WHERE bor.IdUsers = ${user_id}
            GROUP BY b.ISBN;            
            `;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {
                    const borrowings = [];
                    for (const row of result) {
                        borrowings.push(row);
                    }

                    const filePath = "../frontend/views/user/borrowings.ejs";
                    fs.readFile(filePath, 'utf8', function (err, html) {
                        if (err) {
                            connection.release();
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            connection.release();              //release the connection so someone else can use it
                            const renderedHtml = ejs.render(html, { teacher, school_id, user_id, successMessage, failureMessage, borrowings: borrowings });
                            res.send(renderedHtml);
                        }

                    });
                }
            });

        }
    });
});




module.exports = router;
