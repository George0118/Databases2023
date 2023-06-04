const express = require('../node_modules/express');
const ejs = require('../node_modules/ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {
    const user_id = req.query.user_id;

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            q = `SELECT category1, category2, COUNT(*) AS count
            FROM (
                SELECT b1.ISBN, b1.Category AS category1, b2.Category AS category2
                FROM Book_Categories as b1
                JOIN Book_Categories as b2 ON b1.ISBN = b2.ISBN AND b1.Category < b2.Category
                JOIN Borrowing bor ON b1.ISBN = bor.ISBN
                JOIN Users ON Users.IdUsers = bor.IdUsers
                WHERE Users.Approved = 1
            ) AS book3_categories
            GROUP BY category1, category2
            ORDER BY count DESC
            LIMIT 3;          
            `;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();              //release the connection so someone else can use it
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {

                    const filePath = "../frontend/views/general_admin/sixth_query.ejs";

                    const categories = [];
                    for (const row of result) {
                        categories.push(row);
                    }
                      
                    connection.release();              //release the connection so someone else can use it
                    fs.readFile(filePath, 'utf8', function(err, html) {
                        if (err) {
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            const renderedHtml = ejs.render(html, { user_id, categories: categories });
                            res.send(renderedHtml);
                        }
                    });

                }
            });

        }
    });
});


module.exports = router;
