const express = require('../node_modules/express');
const ejs = require('../node_modules/ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/', (req, res) => {
    const category = req.body.category;

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {

            const query = `SELECT DISTINCT book_writers.WriterName AS WriterName
                        FROM book_categories
                        JOIN book_writers ON book_categories.ISBN = book_writers.ISBN
                        WHERE category = ? ;`;

            connection.query(query, [category], (error, result) => {
                if (error) {
                    connection.release();              //release the connection so someone else can use it
                    console.error('Error fetching data from database:', error);
                    res.sendStatus(500);
                } else {

                    const writers = result;

                    const query = `SELECT DISTINCT Teacher.TeacherName AS TeacherName
                                FROM Book_Categories
                                JOIN Borrowing ON book_categories.ISBN = Borrowing.ISBN
                                JOIN Teacher ON Borrowing.IdUsers = Teacher.IdUsers
                                JOIN Users ON Users.IdUsers = Teacher.IdUsers
                                WHERE category = ? AND Borrowing.BorrowDate > DATE_SUB(CURDATE(), INTERVAL 1 YEAR) AND Users.Approved = 1;`;

                    connection.query(query, [category], (error, result) => {
                        if (error) {
                            connection.release();
                            console.error('Error fetching data from database:', error);
                            res.sendStatus(500);
                        } else {

                            const teachers = result;

                            const results = {
                                writers: writers,
                                teachers: teachers
                            }
                            connection.release();              //release the connection so someone else can use it
                            res.json(results);
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;