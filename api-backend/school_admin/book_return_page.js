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
            q = `SELECT Borrowing.*
            FROM Borrowing
            INNER JOIN Users ON Borrowing.IdUsers = Users.IdUsers
            LEFT JOIN Student ON Users.IdUsers = Student.IdUsers
            LEFT JOIN Teacher ON Users.IdUsers = Teacher.IdUsers
            WHERE Borrowing.Returned = 0 AND Users.Approved = 1
              AND (Student.IdSchool = ${school_id} OR Teacher.IdSchool = ${school_id})
            ORDER BY Borrowing.BorrowingID ASC;
            `;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {
                    const due_borrowings = [];
                    for (const row of result) {
                        due_borrowings.push(row);
                    }

                    const filePath = "../frontend/views/school_admin/book_return.ejs";
                    fs.readFile(filePath, 'utf8', function (err, html) {
                        if (err) {
                            connection.release();
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            connection.release();              //release the connection so someone else can use it
                            const renderedHtml = ejs.render(html, { user_id, school_id, successMessage, failureMessage, due_borrowings: due_borrowings });
                            res.send(renderedHtml);
                        }

                    });
                }
            });

        }
    });
});




module.exports = router;
