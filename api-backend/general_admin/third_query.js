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
            q = `SELECT TeacherName, A.count AS TotalBorrowings
            FROM Teacher
            INNER JOIN (
                SELECT IdUsers, COUNT(*) AS count
                FROM Borrowing
                GROUP BY IDUsers
            ) AS A ON Teacher.IdUsers = A.IdUsers
            JOIN Users ON Teacher.IdUsers = Users.IdUsers
            WHERE Teacher.BirthDate > DATE_SUB(CURDATE(), INTERVAL 40 YEAR) AND Users.Approved = 1
            ORDER BY TotalBorrowings DESC;           
            `;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();              //release the connection so someone else can use it
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {

                    const filePath = "../frontend/views/general_admin/third_query.ejs";

                    const teachers = [];
                    for (const row of result) {
                        teachers.push(row);
                    }
                      
                    connection.release();              //release the connection so someone else can use it
                    fs.readFile(filePath, 'utf8', function(err, html) {
                        if (err) {
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            const renderedHtml = ejs.render(html, { user_id, teachers: teachers });
                            res.send(renderedHtml);
                        }
                    });

                }
            });

        }
    });
});


module.exports = router;
