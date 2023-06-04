const express = require('../node_modules/express');
const ejs = require('../node_modules/ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('../node_modules/path');
const router = express.Router();

router.get('/', function (req, res) {
    const successMessage = req.flash('success');
    const failureMessage = req.flash('error');

    const school_id = req.query.school_id;
    const user_id = req.query.user_id;

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            q = `SELECT
            u.IdUsers,
            u.Username,
            CASE
              WHEN s.StudentName IS NOT NULL THEN s.StudentName
              WHEN t.TeacherName IS NOT NULL THEN t.TeacherName
              ELSE 'Unknown'
            END AS Name,
            CASE
              WHEN s.StudentEmail IS NOT NULL THEN s.StudentEmail
              WHEN t.TeacherEmail IS NOT NULL THEN t.TeacherEmail
              ELSE 'Unknown'
            END AS Email
          FROM Users u
          LEFT JOIN Student s ON u.IdUsers = s.IdUsers AND s.IdSchool = ${school_id}
          LEFT JOIN Teacher t ON u.IdUsers = t.IdUsers AND t.IdSchool = ${school_id}
          WHERE u.Approved = 1 AND (s.StudentName IS NOT NULL OR t.TeacherName IS NOT NULL);
          `;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();
                    res.status(400).json({ status: "failed", reason: "Error executing query." });
                    console.log(err);
                }
                else {
                    const accounts = [];
                    for (const row of result) {
                        accounts.push(row);
                    }

                    connection.release();
                    const filePath = "../frontend/views/school_admin/deactivate_accounts.ejs";
                    fs.readFile(filePath, 'utf8', function (err, html) {
                        if (err) {
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            const renderedHtml = ejs.render(html, { user_id, school_id, successMessage, failureMessage, accounts: accounts });
                            res.send(renderedHtml);
                        }

                    });
                }
            });

        }
    });
});




module.exports = router;
