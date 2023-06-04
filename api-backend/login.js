const express = require('express');
const pool = require('./connect');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const router = express.Router();

router.post('/', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const query = `SELECT u.IdUsers, 'Teacher' AS role, t.IdSchool, u.Password, u.Approved
    FROM Teacher t
    INNER JOIN Users u ON t.IdUsers = u.IdUsers
    WHERE u.Username = '${username}'
    UNION
    SELECT u.IdUsers, 'Student' AS role, s.IdSchool, u.Password, u.Approved
    FROM Student s
    INNER JOIN Users u ON s.IdUsers = u.IdUsers
    WHERE u.Username = '${username}'
    UNION
    SELECT u.IdUsers, 'GeneralAdmin' AS role, NULL AS IdSchool, u.Password, u.Approved
    FROM GeneralAdmin g
    INNER JOIN Users u ON g.IdUsers = u.IdUsers
    WHERE u.Username = '${username}'
    UNION
    SELECT u.IdUsers, 'SchoolAdmin' AS role, sa.IdSchool, u.Password, u.Approved
    FROM SchoolAdmin sa
    INNER JOIN Users u ON sa.IdUsers = u.IdUsers
    WHERE u.Username = '${username}'
    LIMIT 1;    
    `;

    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        } else {

            connection.query(query, (err, results) => {
                if (err) {
                    console.error('Error Selecting Data:', err);
                    connection.release();
                    req.flash('error', 'Account Authorization Failed.');
                    res.redirect('/libapp/login_page');
                }
                else {
                    if (results.length === 0) {
                        connection.release();
                        console.log('No results found.');
                        req.flash('error', 'There is no account with this username.');
                        res.redirect('/libapp/login_page');
                    }
                    else {
                        if (password !== results[0].Password) {
                            connection.release();
                            req.flash('error', 'Wrong Password.');
                            res.redirect('/libapp/login_page');
                        }
                        else if (results[0].Approved === 0) {
                            connection.release();
                            req.flash('error', 'User not Approved yet.');
                            res.redirect('/libapp/login_page');
                        }
                        else {
                            if (results[0].role == 'Teacher') {
                                connection.release();
                                const teacher = true;
                                res.redirect(`/libapp/user/starting_page?user_id=${results[0].IdUsers}&school_id=${results[0].IdSchool}&teacher=true`);
                            }
                            else if (results[0].role == 'Student') {
                                connection.release();
                                const teacher = false;
                                res.redirect(`/libapp/user/starting_page?user_id=${results[0].IdUsers}&school_id=${results[0].IdSchool}&teacher=false`);
                            }
                            else if (results[0].role == 'SchoolAdmin') {
                                connection.release();
                                res.redirect(`/libapp/school_admin/starting_page?user_id=${results[0].IdUsers}&school_id=${results[0].IdSchool}`);
                            }
                            else {
                                connection.release();
                                res.redirect(`/libapp/general_admin/starting_page?user_id=${results[0].IdUsers}`);
                            }
                        }
                    }
                }
            });
        }
    });
});

module.exports = router;
