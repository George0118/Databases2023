const express = require('../node_modules/express');
const ejs = require('../node_modules/ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.get('/', function (req, res) {
    const user_id = req.query.user_id;
    const failureMessage = req.flash('error');

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            q = `SELECT DISTINCT YEAR(BorrowDate) AS year
            FROM Borrowing
            ORDER BY year ASC;
            `;
            connection.query(q, function (err, result) {
                if (err) {
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {

                    const filePath = "../frontend/views/general_admin/first_query.ejs";

                    const years = [];
                    for (const row of result) {
                        years.push(row.year);
                    }
                    
                    const months = [
                        "January", 
                        "February", 
                        "March", 
                        "April", 
                        "May", 
                        "June", 
                        "July", 
                        "August", 
                        "September", 
                        "October", 
                        "November", 
                        "December"
                      ];
                      

                    connection.release();              //release the connection so someone else can use it
                    fs.readFile(filePath, 'utf8', function(err, html) {
                        if (err) {
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            const renderedHtml = ejs.render(html, { user_id, months:months, years:years });
                            res.send(renderedHtml);
                        }
                    });


                }
            });

        }
    });
});


module.exports = router;
