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
            q = `SELECT DISTINCT Category
            FROM Book_Categories
            ORDER BY Category ASC;            
            `;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {

                    const filePath = "../frontend/views/general_admin/second_query.ejs";

                    const categories = [];
                    for (const row of result) {
                        categories.push(row.Category);
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
