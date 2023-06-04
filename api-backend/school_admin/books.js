const express = require('express');
const ejs = require('ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {

    const school_id = req.query.school_id;
    const user_id = req.query.user_id;

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            q = `SELECT b.*, 
            GROUP_CONCAT(DISTINCT bc.Category) AS Categories, 
            GROUP_CONCAT(DISTINCT bk.Keyword) AS Keywords, 
            GROUP_CONCAT(DISTINCT bw.WriterName) AS Writers, 
            a.Copies
     FROM Book b
     LEFT JOIN Book_Categories bc ON b.ISBN = bc.ISBN
     LEFT JOIN Book_Keywords bk ON b.ISBN = bk.ISBN
     LEFT JOIN Book_Writers bw ON b.ISBN = bw.ISBN
     LEFT JOIN Availability a ON b.ISBN = a.ISBN
     WHERE a.IdSchool = ${school_id}
     GROUP BY b.ISBN;                      
            `;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {
                    const books = [];
                    for (const row of result) {
                        books.push(row);
                    }

                    const filePath = "../frontend/views/school_admin/books.ejs";
                    fs.readFile(filePath, 'utf8', function (err, html) {
                        if (err) {
                            connection.release();
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            connection.release();              //release the connection so someone else can use it
                            const renderedHtml = ejs.render(html, { user_id, school_id, books: books });
                            res.send(renderedHtml);
                        }

                    });
                }
            });

        }
    });
});




module.exports = router;
