const express = require('../node_modules/express');
const ejs = require('../node_modules/ejs');
const pool = require('../connect');
const fs = require('fs');
const path = require('../node_modules/path');
const router = express.Router();

router.post('/', function (req, res) {
    const admin_id = req.body.adminId;
    const user_id = req.body.user_id;

    pool.getConnection(function (err, connection) {   //get a connection to the database from the pool

        if (err) {
            connection.release();
            res.status(500).json({ status: "failed", reason: "connection to database not established." });
            console.log(err);
        }
        else {
            const q = `UPDATE mydb.Users
            SET Approved = 1
            WHERE IdUsers = ${admin_id};`;
            connection.query(q, function (err, result) {
                if (err) {
                    connection.release();
                    console.log(err);
                    req.flash('error', 'Approval Failed. Something went wrong...');
                    res.redirect(`/libapp/general_admin/admins?user_id=${user_id}`);
                }
                else {
                    connection.release();              //release the connection so someone else can use it
                    req.flash('success', 'Admin Approved!');
                    res.redirect(`/libapp/general_admin/admins?user_id=${user_id}`);
                }
            });

        }
    });
});




module.exports = router;
