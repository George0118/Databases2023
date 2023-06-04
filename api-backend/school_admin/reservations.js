const express = require('express');
const ejs = require('ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('path');
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
            q = `SELECT Reservation.*, 
            CASE
                WHEN Student.IdUsers IS NOT NULL THEN Student.StudentName
                WHEN Teacher.IdUsers IS NOT NULL THEN Teacher.TeacherName
                ELSE 'Unknown'
            END AS Name
        FROM Reservation
        LEFT JOIN Users ON Reservation.IdUsers = Users.IdUsers
        LEFT JOIN Student ON Users.IdUsers = Student.IdUsers AND Student.IdSchool = ${school_id}
        LEFT JOIN Teacher ON Users.IdUsers = Teacher.IdUsers AND Teacher.IdSchool = ${school_id}
        WHERE (CASE
                WHEN Student.IdUsers IS NOT NULL THEN Student.StudentName
                WHEN Teacher.IdUsers IS NOT NULL THEN Teacher.TeacherName
                ELSE 'Unknown'
            END) <> 'Unknown' AND Users.Approved = 1
        ORDER BY Reservation.ReservationID ASC;        
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

                    const filePath = "../frontend/views/school_admin/reservations.ejs";
                    fs.readFile(filePath, 'utf8', function (err, html) {
                        if (err) {
                            connection.release();
                            console.error('Error reading HTML file:', err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            connection.release();              //release the connection so someone else can use it
                            const renderedHtml = ejs.render(html, { user_id, school_id, successMessage, failureMessage, reservations: reservations });
                            res.send(renderedHtml);
                        }

                    });
                }
            });

        }
    });
});




module.exports = router;
